const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

router.get("/all", studentController.getStudents);
router.delete("/delete/:id", studentController.deleteStudent);
router.get("/filter", studentController.filterStudents);

module.exports = router;
