const gradeModel = require("../models/gradeModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");

const createClass = async (req, res) => {
  const { instructor, instructorId, schoolYear, semester, students, subjects } =
    req.body;
  try {
    const gradeEntries = [];

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    for (const student of students) {
      for (const subject of subjects) {
        // 🔥 Check if student is already enrolled in this subject for the given semester and school year
        const existingRecord = await gradeModel.findOne({
          where: {
            studentId: student.id,
            subjectId: subject.id,
            schoolYear,
            semester,
          },
        });

        if (existingRecord) {
          return res.status(400).json({
            message: `Student ${student.fullName} is already enrolled in ${subject.subjectCode}.`,
          });
        }

        gradeEntries.push({
          studentId: Number(student.id),
          subjectId: subject.id,
          studentName: student.fullName,
          subjectCode: subject.subjectCode,
          description: subject.description,
          instructor,
          instructorId: Number(instructorId),
          schoolYear,
          semester,
          grade: null,
          remarks: null,
          createdAt: sequelize.literal(`'${formattedDate}'`),
        });
      }
    }

    const grades = await gradeModel.bulkCreate(gradeEntries);
    return res
      .status(201)
      .json({ message: "Class created successfully", grades, status: 201 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await gradeModel.findAll();
    return res.status(200).json({ classes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getClass = async (req, res) => {
  const { id } = req.params;
  try {
    const grade = await gradeModel.findOne({ where: { id } });
    return res.status(200).json({ grade });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  const { id } = req.params;
  const { instructor, instructorId, schoolYear, semester, students, subjects } =
    req.body;

  try {
    const gradeEntries = [];
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    for (const student of students) {
      for (const subject of subjects) {
        gradeEntries.push({
          studentId: student.id,
          subjectId: subject.id,
          instructor,
          instructorId,
          schoolYear,
          semester,
          grade: null,
          remarks: null,
          updatedAt: sequelize.literal(`'${formattedDate}'`),
        });
      }
    }

    const grades = await gradeModel.update(gradeEntries, { where: { id } });
    return res
      .status(201)
      .json({ message: "Class updated successfully", grades });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    await gradeModel.destroy({ where: { id } });
    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getClassByInstructorSemSY = async (req, res) => {
  const { instructorId, subjectCode, semester, schoolYear } = req.params;
  try {
    const classes = await gradeModel.findAll({
      where: { instructorId, subjectCode, semester, schoolYear },
    });
    return res.status(200).json({ classes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStudentSubjectsBySemSY = async (req, res) => {
  const { studentId } = req.params; // Only need studentId to get all semesters and school years

  try {
    const studentData = await userModel.findOne({
      where: { studentId: studentId },
      include: [
        {
          model: studentModel,
          as: "student",
          attributes: ["course", "yearLevel"],
        },
      ],
    });

    const subjects = await gradeModel.findAll({
      where: { studentId: Number(studentId) },
      order: [
        ["schoolYear", "DESC"],
        ["semester", "ASC"],
        ["createdAt", "ASC"],
      ], // Sort by school year, semester, then date
    });

    if (!subjects.length) {
      return res
        .status(404)
        .json({ message: "No subjects found for this student." });
    }

    // Group subjects by school year and semester
    const groupedSubjects = subjects.reduce((acc, subject) => {
      const key = `${subject.schoolYear} - ${subject.semester}`;
      if (!acc[key]) {
        acc[key] = {
          schoolYear: subject.schoolYear,
          semester: subject.semester,
          subjects: [],
        };
      }
      acc[key].subjects.push({
        subjectId: subject.subjectId,
        subjectCode: subject.subjectCode,
        description: subject.description,
        instructor: subject.instructor,
        grade: subject.grade,
        remarks: subject.remarks,
      });
      return acc;
    }, {});

    return res.status(200).json({
      studentId: subjects[0].studentId,
      studentName: subjects[0].studentName,
      address: studentData.address,
      course: studentData.student.course,
      yearLevel: studentData.student.yearLevel,
      academicRecords: Object.values(groupedSubjects), // Convert grouped object into an array
    });
  } catch (error) {
    console.error("Error fetching student subjects:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// const getAllSubjectWithInstructor = async (req, res) => {
//   const { semester, schoolYear } = req.params;

//   try {
//     // Fetch all subjects grouped by subjectCode, description, and instructor
//     const subjects = await gradeModel.findAll({
//       where: { semester, schoolYear },
//       attributes: [
//         "subjectCode",
//         "description",
//         "instructor",
//         "schoolYear",
//         "semester",
//       ],
//       group: [
//         "subjectCode",
//         "description",
//         "instructor",
//         "schoolYear",
//         "semester",
//       ],
//     });

//     // Fetch all students grouped by subjectCode
//     const students = await gradeModel.findAll({
//       where: { semester, schoolYear },
//       attributes: ["studentId", "studentName", "subjectCode"],
//     });

//     // Map subjects and attach students to each subject
//     const subjectList = subjects.map((subject) => {
//       return {
//         subjectCode: subject.subjectCode,
//         description: subject.description,
//         instructor: subject.instructor,
//         schoolYear: subject.schoolYear,
//         semester: subject.semester,
//         students: students
//           .filter((student) => student.subjectCode === subject.subjectCode)
//           .map((student) => ({
//             id: student.studentId,
//             fullName: student.studentName,
//           })),
//       };
//     });

//     return res.status(200).json(subjectList);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };

const getAllSubjectWithInstructor = async (req, res) => {
  const { name, semester, schoolYear } = req.query;

  try {
    const whereCondition = {}; // Default: No filter, fetch all data

    // Apply filters only if values are provided
    if (name) whereCondition.instructor = { [Op.like]: `${name}%` };

    if (semester && semester !== "all") whereCondition.semester = semester;
    if (schoolYear && schoolYear !== "all")
      whereCondition.schoolYear = schoolYear;

    // Fetch all subjects with instructors
    const subjects = await gradeModel.findAll({
      where: whereCondition, // Uses filters if provided, otherwise fetches all
      attributes: [
        "subjectCode",
        "description",
        "instructorId",
        "instructor",
        "schoolYear",
        "semester",
      ],
      group: [
        "subjectCode",
        "description",
        "instructorId",
        "instructor",
        "schoolYear",
        "semester",
      ],
      order: [
        ["schoolYear", "DESC"],
        ["semester", "DESC"],
      ],
    });

    // Fetch all students (filtered if params exist)
    const students = await gradeModel.findAll({
      where: whereCondition, // Uses filters if provided
      attributes: ["id", "studentId", "studentName", "subjectCode"],
      order: [["subjectCode", "DESC"]],
    });

    // Map subjects and attach related students
    const subjectList = subjects.map((subject) => ({
      subjectCode: subject.subjectCode,
      description: subject.description,
      instructor: subject.instructor,
      instructorId: subject.instructorId,
      schoolYear: subject.schoolYear,
      semester: subject.semester,
      students: students
        .filter((student) => student.subjectCode === subject.subjectCode)
        .map((student) => ({
          id: student.id,
          studentId: student.studentId,
          fullName: student.studentName,
        })),
    }));

    return res.status(200).json(subjectList);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getClassByInstructorSemSySubjectCode = async (req, res) => {
  const { instructorId, semester, schoolYear, subjectCode } = req.params;

  try {
    // Fetch the subject details
    const subject = await gradeModel.findOne({
      where: { instructorId, semester, schoolYear, subjectCode },
      attributes: [
        "subjectId",
        "subjectCode",
        "description",
        "instructorId",
        "instructor",
        "schoolYear",
        "semester",
      ],
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // Fetch students enrolled in this specific subject
    const students = await gradeModel.findAll({
      where: { instructorId, semester, schoolYear, subjectCode },
      attributes: ["id", "studentId", "studentName"],
      order: [["studentName", "ASC"]],
    });

    const subjectWithStudents = {
      subjectId: subject.subjectId,
      subjectCode: subject.subjectCode,
      description: subject.description,
      instructor: subject.instructor,
      instructorId: subject.instructorId,
      schoolYear: subject.schoolYear,
      semester: subject.semester,
      students: students.map((student) => ({
        id: student.id,
        studentId: student.studentId,
        fullName: student.studentName,
      })),
    };

    return res.status(200).json(subjectWithStudents);
  } catch (error) {
    console.error("Error fetching class:", error);
    return res.status(500).json({ message: error.message });
  }
};

const removeStudentFromClass = async (req, res) => {
  const { studentId } = req.params;
  try {
    await gradeModel.destroy({ where: { id: studentId } });
    return res
      .status(200)
      .json({ message: "Student removed from class", status: 200 });
  } catch (error) {
    console.error("Error removing student from class:", error);
    return res.status(500).json({ message: error.message });
  }
};

const addStudentToClass = async (req, res) => {
  const {
    studentId,
    studentName,
    subjectId,
    subjectCode,
    description,
    instructorId,
    instructor,
    semester,
    schoolYear,
  } = req.body;

  try {
    // Check if student is already enrolled in the class
    const existingRecord = await gradeModel.findOne({
      where: { studentId, subjectCode, instructorId, semester, schoolYear },
    });

    if (existingRecord) {
      return res.status(400).json({
        message: `${studentName} is already enrolled in this class.`,
      });
    }

    // Add student to the class
    const newRecord = await gradeModel.create({
      studentId,
      studentName,
      subjectId,
      subjectCode,
      description,
      instructorId,
      instructor,
      semester,
      schoolYear,
      grade: null,
      remarks: null,
    });

    return res
      .status(201)
      .json({ message: "Student added to class", newRecord, status: 201 });
  } catch (error) {
    console.error("Error adding student to class:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
  getClassByInstructorSemSY,
  getStudentSubjectsBySemSY,
  getAllSubjectWithInstructor,
  getClassByInstructorSemSySubjectCode,
  removeStudentFromClass,
  addStudentToClass,
};
