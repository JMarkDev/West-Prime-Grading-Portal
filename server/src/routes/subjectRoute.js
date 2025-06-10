const subjectController = require("../controllers/subjectController");
const express = require("express");
const router = express.Router();
const {
  addSubjectValidation,
  validateForm,
} = require("../middlewares/formValidation");

router.get("/all", subjectController.getSubjects);
router.post(
  "/add",
  // addSubjectValidation(),
  // validateForm,
  subjectController.addSubject
);
router.put(
  "/update/:id",
  addSubjectValidation(),
  validateForm,
  subjectController.updateSubject
);
router.get("/id/:id", subjectController.getSubjectById);
router.delete("/delete/:id", subjectController.deleteSubject);
router.get("/search", subjectController.searchSubject);

module.exports = router;
