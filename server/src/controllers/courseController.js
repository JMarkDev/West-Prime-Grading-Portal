const courseModel = require("../models/courseModel");
const { Op } = require("sequelize");
const date = require("date-and-time");
const sequelize = require("../config/database");

const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id);
    const course = await courseModel.findByPk(id);
    return res.json(course);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  const { courseCode, courseName } = req.body;

  try {
    const courseExists = await courseModel.findOne({
      where: { courseCode },
    });

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    if (courseExists) {
      return res.status(400).json({
        message: "Course already exists",
        status: "error",
      });
    }
    const course = await courseModel.create({
      courseCode,
      courseName,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });
    return res.status(200).json({
      course,
      message: "Course added successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseCode, courseName } = req.body;

  try {
    const courseExists = await courseModel.findByPk(id);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const course = await courseModel.update(
      {
        courseCode,
        courseName,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { id },
      }
    );
    return res.status(200).json({
      course,
      message: "Course updated successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await courseModel.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await courseModel.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      message: "Course deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchCourses = async (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ message: "searchTerm is required" });
  }

  try {
    const searchCriteria = {
      where: {
        [Op.or]: [
          { courseCode: { [Op.like]: `${searchTerm}%` } },
          { courseName: { [Op.like]: `${searchTerm}%` } },
        ],
      },
    };

    const courses = await courseModel.findAll(searchCriteria);

    return res.json(courses);
  } catch (error) {
    console.error("Error searching courses:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
};
