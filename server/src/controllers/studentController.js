const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");
const rolesList = require("../constants/rolesList");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const schoolYearModel = require("../models/schoolYearModel");
const courseModel = require("../models/courseModel");

const getStudents = async (req, res) => {
  try {
    const students = await userModel.findAll({
      where: { role: rolesList.student },
      include: [
        {
          model: studentModel,
          as: "student", // Use the alias from the association
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await userModel.destroy({ where: { id } });
    return res
      .status(200)
      .json({ message: "Student deleted successfully", status: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filterStudents = async (req, res) => {
  const { name, course, yearLevel, schoolYear } = req.query;

  // Conditions for userModel (firstName, lastName)
  const userWhereCondition = {};
  if (name) {
    userWhereCondition[Op.or] = [
      { firstName: { [Op.like]: `${name}%` } },
      { lastName: { [Op.like]: `${name}%` } },
    ];
  }

  // Conditions for studentModel (course, yearLevel)
  const studentWhereCondition = {};
  if (course) {
    studentWhereCondition.course = course;
  }
  if (yearLevel) {
    studentWhereCondition.yearLevel = yearLevel;
  }

  if (schoolYear) {
    studentWhereCondition.schoolYear = schoolYear;
  }

  try {
    const students = await userModel.findAll({
      where: userWhereCondition,
      include: [
        {
          model: studentModel,
          as: "student", // ✅ Specify alias (this must match your association)
          required: true,
          where: studentWhereCondition,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllStudentEnrollmentByCourse = async (req, res) => {
  const { schoolYear } = req.params;

  try {
    // Fetch all courses from courseModel
    const courses = await courseModel.findAll({
      attributes: ["courseCode"],
      raw: true,
    });

    // Fetch student counts per course for the given school year
    const students = await studentModel.findAll({
      where: { schoolYear },
      attributes: [
        "course",
        [sequelize.fn("count", sequelize.col("course")), "total"],
      ],
      group: ["course"],
      raw: true,
    });

    // Convert student data into a lookup object
    const studentCounts = students.reduce((acc, student) => {
      acc[student.course] = student.total;
      return acc;
    }, {});

    // Merge courses with studentCounts (ensuring all courses are included)
    const formattedCourses = courses.map(({ courseCode }) => ({
      course: courseCode,
      total: studentCounts[courseCode] || 0, // Default to 0 if no students
      schoolYear, // Include the school year in response
    }));

    return res.status(200).json(formattedCourses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllStudentBySchoolYear = async (req, res) => {
  try {
    const schoolYears = await schoolYearModel.findAll({
      attributes: ["schoolYear"],
      raw: true,
    });

    const students = await studentModel.findAll({
      attributes: [
        "schoolYear",
        [sequelize.fn("count", sequelize.col("schoolYear")), "total"],
      ],
      group: ["schoolYear"],
      raw: true,
    });

    const studentCounts = students.reduce((acc, student) => {
      acc[student.schoolYear] = student.total;
      return acc;
    }, {});

    const formattedStudents = schoolYears.map(({ schoolYear }) => {
      return {
        year: schoolYear,
        total: studentCounts[schoolYear] || 0,
      };
    });

    return res.status(200).json(formattedStudents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  deleteStudent,
  filterStudents,
  getAllStudentEnrollmentByCourse,
  getAllStudentBySchoolYear,
};
