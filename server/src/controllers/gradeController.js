const gradeModel = require("../models/gradeModel");

const getGrades = async (req, res) => {
  try {
    const grades = await gradeModel.findAll();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGrades,
};
