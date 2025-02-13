const gradeController = require("../controllers/gradeController");
const express = require("express");
const router = express.Router();

router.get("/", gradeController.getGrades);

module.exports = router;
