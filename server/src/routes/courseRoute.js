const courseController = require("../controllers/courseController");
const express = require("express");
const router = express.Router();
const {
  addCourseValidation,
  validateForm,
} = require("../middlewares/formValidation");

router.get("/all", courseController.getCourses);
router.get("/id/:id", courseController.getCourseById);
router.post(
  "/add",
  addCourseValidation(),
  validateForm,
  courseController.createCourse
);
router.put(
  "/update/:id",
  addCourseValidation(),
  validateForm,
  courseController.updateCourse
);
router.delete("/delete/:id", courseController.deleteCourse);
router.get("/search", courseController.searchCourses);

module.exports = router;
