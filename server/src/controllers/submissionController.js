const Submission = require("../models/submissionModel");

// CREATE
const createSubmission = async (req, res) => {
  try {
    const { schoolYear, semester, dateAndTime } = req.body;

    const existSubmission = await Submission.findAll({
      where: {
        schoolYear,
        semester,
      },
    });

    if (existSubmission.length > 0) {
      return res.status(400).json({ message: "Submission already exists" });
    }
    const newSubmission = await Submission.create({
      schoolYear,
      semester,
      dateAndTime,
      createdAt: new Date(),
    });
    res.status(201).json({
      newSubmission,
      status: "success",
      message: "Submission created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      order: [["dateAndTime", "DESC"]],
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE (by ID)
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateSubmission = async (req, res) => {
  try {
    const { schoolYear, semester, dateAndTime } = req.body;
    const submission = await Submission.findByPk(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    await submission.update({
      schoolYear,
      semester,
      dateAndTime,
      updatedAt: new Date(),
    });
    res.json({
      submission,
      status: "success",
      message: "Updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    await submission.destroy();
    res.json({ message: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET LATEST SUBMISSION
const getLatestSubmission = async (req, res) => {
  try {
    const latest = await Submission.findOne({
      order: [["dateAndTime", "DESC"]],
    });
    if (!latest)
      return res.status(404).json({ message: "No submissions found" });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
  getLatestSubmission,
};
