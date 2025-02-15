const express = require("express");
const classController = require("../controllers/classController");
const router = express.Router();

router.post("/add", classController.createClass);
router.get("/all", classController.getClasses);
router.get("/id/:id", classController.getClass);
router.put("/update/:id", classController.updateClass);
router.delete(
  "/delete/instructorId/:instructorId/subjectCode/:subjectCode/semester/:semester/schoolYear/:schoolYear",
  classController.deleteClass
);
router.get(
  "/instructor/:instructorId/subjectCode/:subjectCode/semester/:semester/schoolYear/:schoolYear",
  classController.getClassByInstructorSemSY
);
router.get("/studentId/:studentId", classController.getStudentSubjectsBySemSY);
// router.get(
//   "/all/subject/semester/:semester/schoolYear/:schoolYear",
//   classController.getAllSubjectWithInstructor
// );
router.get("/all-subjects", classController.getAllSubjectWithInstructor);
router.get(
  "/instructorId/:instructorId/semester/:semester/schoolYear/:schoolYear/subjectCode/:subjectCode",
  classController.getClassByInstructorSemSySubjectCode
);

router.delete(
  "/remove-student/studentId/:studentId",
  classController.removeStudentFromClass
);

router.post("/add-student", classController.addStudentToClass);

router.get(
  "/instructorId/:instructorId",
  classController.getAllSubjectByInstructor
);
module.exports = router;
