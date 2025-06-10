const gradeModel = require("../models/gradeModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");

const createClass = async (req, res) => {
  const {
    instructor,
    instructorId,
    schoolYear,
    semester,
    students,
    subjects,
    yearLevel,
    course,
  } = req.body;

  try {
    const gradeEntries = [];

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const existingClass = await gradeModel.findOne({
      where: { instructorId, schoolYear, semester },
    });

    console.log(existingClass);

    if (existingClass) {
      return res.status(400).json({
        message: `Class for ${instructor} already exists for SY ${schoolYear} - ${semester}.`,
      });
    }

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
          yearLevel: yearLevel,
          course: course,
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

// const updateClass = async (req, res) => {
//   const { id } = req.params;
//   const { instructor, instructorId, schoolYear, semester, students, subjects } =
//     req.body;

//   try {
//     const gradeEntries = [];
//     const createdAt = new Date();
//     const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

//     for (const student of students) {
//       for (const subject of subjects) {
//         gradeEntries.push({
//           studentId: student.id,
//           subjectId: subject.id,
//           instructor,
//           instructorId,
//           schoolYear,
//           semester,
//           grade: null,
//           remarks: null,
//           updatedAt: sequelize.literal(`'${formattedDate}'`),
//         });
//       }
//     }

//     const grades = await gradeModel.update(gradeEntries, { where: { id } });
//     return res
//       .status(201)
//       .json({ message: "Class updated successfully", grades });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const deleteClass = async (req, res) => {
  const { instructorId, subjectCode, semester, schoolYear } = req.params;

  try {
    console.log(instructorId, subjectCode, semester, schoolYear);
    await gradeModel.destroy({
      where: { instructorId, subjectCode, semester, schoolYear },
    });
    return res
      .status(200)
      .json({ message: "Class deleted successfully", status: "success" });
  } catch (error) {
    console.error("Error deleting class:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getClassByInstructorSemSY = async (req, res) => {
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
          attributes: ["course", "yearLevel", "studentId", "status", "section"],
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
      return res.status(200).json({
        id: studentData?.id, // Use studentData if available
        studentId: studentData?.student.studentId,
        studentName: `${studentData.firstName} ${studentData.middleInitial}. ${studentData.lastName}`, // Fallback if name is missing
        address: studentData?.address, // Default address
        course: studentData?.student?.course,
        yearLevel: studentData?.student?.yearLevel,
        status: studentData?.student?.status,
        section: studentData?.student?.section,
        academicRecords: [], // Return an empty array instead of 404
      });
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
        id: subject.id,
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
      id: studentData.id,
      image: studentData.image,
      studentName: subjects[0].studentName,
      studentId: studentData.student.studentId,
      address: studentData.address,
      course: studentData.student.course,
      yearLevel: studentData.student.yearLevel,
      status: studentData.student.status,
      section: studentData.student.section,
      academicRecords: Object.values(groupedSubjects), // Convert grouped object into an array
    });
  } catch (error) {
    console.error("Error fetching student subjects:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const filterAllStudentClass = async (req, res) => {
  const { name, course, yearLevel, schoolYear, status, section } = req.query;
  console.log(req.query, "query");

  try {
    // Find all the students base on filter
    const userWhere = {};
    if (name) {
      userWhere[Op.or] = [
        { firstName: { [Op.like]: `${name}%` } },
        { lastName: { [Op.like]: `${name}%` } },
      ];
    }

    // Build student filter
    const studentWhere = {};
    if (course) studentWhere.course = course;
    if (yearLevel) studentWhere.yearLevel = yearLevel;
    if (schoolYear) studentWhere.schoolYear = schoolYear;
    if (status) studentWhere.status = status;
    if (section) studentWhere.section = section;

    // Fetch students
    const students = await userModel.findAll({
      where: userWhere,
      include: [
        {
          model: studentModel,
          as: "student",
          required: true,
          where: studentWhere,
          attributes: ["course", "yearLevel", "studentId", "status", "section"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Map over each student to get their subject records
    const result = await Promise.all(
      students.map(async (studentData) => {
        const grades = await gradeModel.findAll({
          where: {
            studentId: studentData.studentId,
          },
          order: [
            ["schoolYear", "DESC"],
            ["semester", "ASC"],
            ["createdAt", "ASC"],
          ],
        });

        // Group subjects by school year and semester
        const groupedSubjects = grades?.reduce((acc, subject) => {
          const key = `${subject.schoolYear} - ${subject.semester}`;
          if (!acc[key]) {
            acc[key] = {
              schoolYear: subject.schoolYear,
              semester: subject.semester,
              subjects: [],
            };
          }
          acc[key].subjects.push({
            id: subject.id,
            subjectId: subject.subjectId,
            subjectCode: subject.subjectCode,
            description: subject.description,
            instructor: subject.instructor,
            grade: subject.grade,
            remarks: subject.remarks,
          });
          return acc;
        }, {});

        return {
          id: studentData.studentId,
          studentId: studentData.student.studentId,
          studentName: `${studentData.firstName} ${studentData.middleInitial}. ${studentData.lastName}`,
          address: studentData.address,
          image: studentData.image,
          course: studentData.student.course,
          yearLevel: studentData.student.yearLevel,
          status: studentData.student.status,
          section: studentData.student.section,
          academicRecords: Object.values(groupedSubjects),
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllSubjectByInstructor = async (req, res) => {
  const { instructorId } = req.params;

  try {
    const subjects = await gradeModel.findAll({
      where: { instructorId: Number(instructorId) },
      order: [
        ["schoolYear", "DESC"],
        ["semester", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    if (!subjects.length) {
      return res
        .status(404)
        .json({ message: "No subjects found for this instructor." });
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

      // Ensure unique subjects using a Set
      const existingSubjectIds = new Set(
        acc[key].subjects.map((s) => s.subjectId)
      );

      if (!existingSubjectIds.has(subject.subjectId)) {
        acc[key].subjects.push({
          id: subject.id,
          subjectId: subject.subjectId,
          subjectCode: subject.subjectCode,
          description: subject.description,
          course: subject.course,
          instructor: subject.instructor,
          grade: subject.grade,
          remarks: subject.remarks,
        });
      }

      return acc;
    }, {});

    return res.status(200).json({
      academicRecords: Object.values(groupedSubjects),
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllSubjectWithInstructor = async (req, res) => {
  const { name, semester, schoolYear, course, yearLevel } = req.query;

  try {
    const whereCondition = {}; // Default: No filter, fetch all data

    // Apply filters only if values are provided
    if (name) whereCondition.instructor = { [Op.like]: `${name}%` };

    if (semester && semester !== "all") whereCondition.semester = semester;
    if (schoolYear && schoolYear !== "all")
      whereCondition.schoolYear = schoolYear;
    if (course && course !== "all") whereCondition.course = course;
    if (yearLevel && yearLevel !== "all") whereCondition.yearLevel = yearLevel;

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
        "yearLevel",
        "course",
      ],
      group: [
        "subjectCode",
        "description",
        "instructorId",
        "instructor",
        "schoolYear",
        "semester",
        "yearLevel",
        "course",
      ],
      order: [
        ["schoolYear", "DESC"],
        ["semester", "DESC"],
        ["course", "DESC"],
        ["yearLevel", "DESC"],
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
      yearLevel: subject.yearLevel,
      course: subject.course,
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
        "id",
        "subjectId",
        "subjectCode",
        "description",
        "instructorId",
        "instructor",
        "schoolYear",
        "semester",
        "course",
        "yearLevel",
      ],
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // Fetch students enrolled in this specific subject
    const students = await gradeModel.findAll({
      where: { instructorId, semester, schoolYear, subjectCode },
      attributes: ["id", "studentId", "studentName", "grade", "remarks"],
      order: [["studentName", "ASC"]],
    });

    const subjectWithStudents = {
      id: subject.id,
      subjectId: subject.subjectId,
      subjectCode: subject.subjectCode,
      description: subject.description,
      instructor: subject.instructor,
      instructorId: subject.instructorId,
      schoolYear: subject.schoolYear,
      semester: subject.semester,
      course: subject.course,
      yearLevel: subject.yearLevel,
      students: students.map((student) => ({
        id: student.id,
        studentId: student.studentId,
        fullName: student.studentName,
        grade: student.grade,
        remarks: student.remarks,
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
    course,
    yearLevel,
  } = req.body;

  console.log(req.body);

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
      course,
      yearLevel,
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

const inputGrades = async (req, res) => {
  const { grades } = req.body;

  try {
    await gradeModel.sequelize.transaction(async (t) => {
      for (const { id, grade } of grades) {
        let remarks;

        if (grade === "INC") {
          remarks = "INCOMPLETE";
        } else if (!isNaN(grade)) {
          const numericGrade = parseFloat(grade).toFixed(2);
          remarks = numericGrade > 3.0 ? "Failed" : "Passed";

          // Save as string like '1.00'
          await gradeModel.update(
            { grade: numericGrade.toString(), remarks },
            { where: { id }, transaction: t }
          );
          continue;
        } else {
          remarks = ""; // invalid input fallback
        }

        await gradeModel.update(
          { grade, remarks },
          { where: { id }, transaction: t }
        );
      }
    });

    return res
      .status(200)
      .json({ message: "Grades updated successfully", status: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  const { id } = req.params;
  const {
    subjectId,
    yearLevel,
    semester,
    schoolYear,
    instructor,
    instructorId,
    subjectCode,
    description,
  } = req.body;

  try {
    const updatedClass = await gradeModel.update(
      {
        instructor: instructor,
        instructorId: instructorId,
        subjectCode: subjectCode,
        description: description,
        subjectId: subjectId,
        yearLevel: yearLevel,
        schoolYear: schoolYear,
        semester: semester,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      message: "Class updated successfully",
      status: "success",
      updatedClass,
    });
  } catch (error) {
    console.error(error);
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
  getAllSubjectByInstructor,
  inputGrades,
  filterAllStudentClass,
};
