const subjectModel = require("../models/subjectModel");
const { Op } = require("sequelize");

const getSubjects = async (req, res) => {
  try {
    const subjects = await subjectModel.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addSubject = async (req, res) => {
  const { subjectCode, description, units } = req.body;

  try {
    const subjectExists = await subjectModel.findOne({
      where: { subjectCode },
    });

    if (subjectExists) {
      return res.status(400).json({
        message: "Subject already exists",
        status: "error",
      });
    }
    const subject = await subjectModel.create({
      subjectCode,
      description,
      units,
    });
    return res.status(201).json({
      subject,
      message: "Subject added successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subjectCode, description, units } = req.body;
  console.log(req.body);

  try {
    const subject = await subjectModel.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subjectModel.update(
      { subjectCode, description, units },
      {
        where: { id },
      }
    );
    return res.json({
      subject,
      message: "Subject updated successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getSubjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await subjectModel.findByPk(id);
    return res.json(subject);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    await subjectModel.destroy({
      where: { id },
    });
    return res.json({
      message: "Subject deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchSubject = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const searchCriteria = {
      where: {
        [Op.or]: [
          { subjectCode: { [Op.like]: `${searchTerm}%` } },
          { description: { [Op.like]: `${searchTerm}%` } },
        ],
      },
    };
    const subjects = await subjectModel.findAll(searchCriteria);
    return res.json(subjects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  addSubject,
  // updateSubject,
  // getSubjectById,
  // deleteSubject,
  // searchSubject,
};
