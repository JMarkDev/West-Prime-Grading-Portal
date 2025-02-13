const express = require("express");
const schoolYearController = require("../controllers/schoolYearController");
const {
  addSchoolYearValidation,
  validateForm,
} = require("../middlewares/formValidation");
const route = express.Router();

route.get("/all", schoolYearController.getAllSchoolYears);
route.get("/id/:id", schoolYearController.getSchoolYearById);
route.post(
  "/create",
  addSchoolYearValidation(),
  validateForm,
  schoolYearController.createSchoolYear
);
route.put(
  "/update/:id",
  addSchoolYearValidation(),
  validateForm,
  schoolYearController.updateSchoolYear
);
route.delete("/delete/:id", schoolYearController.deleteSchoolYear);
route.get("/search", schoolYearController.searchSchoolYear);

module.exports = route;
