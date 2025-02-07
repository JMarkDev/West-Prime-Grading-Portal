const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");
const rolesList = require("../constants/rolesList");

const getStudents = async (req, res) => {
  try {
    const students = await userModel.findAll({
      where: { role: rolesList.student },
      include: [
        {
          model: studentModel,
          required: true,
        },
      ],
    });
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
};
