const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");
const rolesList = require("../constants/rolesList");
const { Op } = require("sequelize");

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

    console.log(students, "students");
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
  const { name, course, yearLevel } = req.query;

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

  try {
    const students = await userModel.findAll({
      where: userWhereCondition,
      include: [
        {
          model: studentModel,
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

module.exports = {
  getStudents,
  deleteStudent,
  filterStudents,
};
