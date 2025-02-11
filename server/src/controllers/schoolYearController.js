const schoolYearModel = require("../models/schoolyearModel");
const { Op } = require("sequelize");
const date = require("date-and-time");
const sequelize = require("../config/database");

const getAllSchoolYears = async (req, res) => {
  try {
    const schoolYears = await schoolYearModel.findAll({
      order: [["schoolYear", "DESC"]],
    });
    return res.status(200).json(schoolYears);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSchoolYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolYear = await schoolYearModel.findByPk(id);
    if (schoolYear) {
      return res.status(200).json(schoolYear);
    }
    return res
      .status(404)
      .json({ message: `School year with id ${id} not found` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createSchoolYear = async (req, res) => {
  const { schoolYear } = req.body;

  try {
    const existingSchoolYear = await schoolYearModel.findOne({
      where: { schoolYear },
    });

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    if (existingSchoolYear) {
      return res.status(400).json({
        message: "School year already exists",
        status: "error",
      });
    }
    const newSchoolYear = await schoolYearModel.create({
      schoolYear: schoolYear,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });
    return res.status(201).json({
      newSchoolYear,
      message: "School year added successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSchoolYear = async (req, res) => {
  const { id } = req.params;
  const { schoolYear } = req.body;

  try {
    const schoolYearExist = await schoolYearModel.findByPk(id);

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    if (!schoolYearExist) {
      return res.status(404).json({ message: "School year not found" });
    }

    await schoolYearModel.update(
      {
        schoolYear: schoolYear,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      schoolYearExist,
      message: "School year updated successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteSchoolYear = async (req, res) => {
  const { id } = req.params;

  try {
    const schoolYearToDelete = await schoolYearModel.findByPk(id);
    if (schoolYearToDelete) {
      await schoolYearToDelete.destroy();
      return res.status(200).json({
        message: "Delected school year successfully",
        status: "success",
      });
    }
    return res
      .status(404)
      .json({ message: `School year with id ${id} not found` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchSchoolYear = async (req, res) => {
  const { schoolYear } = req.query;

  try {
    const schoolYears = await schoolYearModel.findAll({
      where: { schoolYear: { [Op.like]: `${schoolYear}%` } },
    });
    return res.status(200).json(schoolYears);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSchoolYears,
  getSchoolYearById,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear,
  searchSchoolYear,
};
