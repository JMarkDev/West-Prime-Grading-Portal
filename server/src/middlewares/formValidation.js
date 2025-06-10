const { body, validationResult } = require("express-validator");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reusable validation functions
const validateEmail = () => {
  return body("email").custom((value) => {
    if (!value) {
      throw new Error("Email is required");
    }
    if (!value.match(emailRegex)) {
      throw new Error("Enter a valid email address(e.g. sample@gmail.com).");
    }
    return true;
  });
};

const validatePassword = () => {
  return body("password").custom((value) => {
    if (!value) {
      throw new Error("Password is required");
    }
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    return true;
  });
};

const validateForgotPassword = () => {
  return [
    body("password").custom((value) => {
      if (!value) {
        throw new Error("Password is required");
      }
      if (value.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      return true;
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (!value) {
        throw new Error("Confirm password is required");
      }
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
};

const validateRequiredField = (fieldName) => {
  const fieldNameWithSpaces = fieldName
    .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${fieldNameWithSpaces} is required`);
};

// Validation rules for login
const loginValidationRules = () => {
  return [validateEmail(), validateRequiredField("password")];
};

// Validation rules for register
const registerValidationRules = (isUpdate = false) => {
  return [
    validateRequiredField("firstName"),
    validateRequiredField("lastName"),
    validateRequiredField("middleInitial"),
    validateEmail(),
    validateRequiredField("contactNumber"),
    validateRequiredField("address"),

    // Skip password validation for updates
    isUpdate ? body("password").optional() : validatePassword(),

    body("confirmPassword").custom((value, { req }) => {
      if (!isUpdate) {
        // Only validate during registration
        if (!value) {
          throw new Error("Confirm password is required");
        }

        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
      }
      return true;
    }),

    body("contactNumber").custom((value, { req }) => {
      if (!value) {
        throw new Error("Contact Number is required");
      }

      if (req.body.contactNumber && req.body.contactNumber.length !== 11) {
        throw new Error("Contact Number must be 11 digits");
      }
      return true;
    }),
    body("course").custom((value, { req }) => {
      if (req.body.role === 3) {
        if (!value) {
          throw new Error("Course is required");
        }
      }
      return true;
    }),
    body("yearLevel").custom((value, { req }) => {
      if (req.body.role === 3) {
        if (!value) {
          throw new Error("Year Level is required");
        }
      }
      return true;
    }),
    body("schoolYear").custom((value, { req }) => {
      if (req.body.role === 3) {
        if (!value) {
          throw new Error("School Year is required");
        }
      }
      return true;
    }),
    body("status").custom((value, { req }) => {
      if (req.body.role === 3) {
        if (!value) {
          throw new Error("Status is required");
        }
      }
      return true;
    }),
    body("section").custom((value, { req }) => {
      if (req.body.role === 3) {
        if (!value) {
          throw new Error("Section is required");
        }
      }
      return true;
    }),
  ];
};

const addSubjectValidation = () => {
  return [
    validateRequiredField("subjectCode"),
    validateRequiredField("description"),
    validateRequiredField("units"),
  ];
};

const addCourseValidation = () => {
  return [
    validateRequiredField("courseCode"),
    validateRequiredField("courseName"),
  ];
};

const addSchoolYearValidation = () => {
  return [validateRequiredField("schoolYear")];
};

const updateProfileValidation = () => {
  return [
    validateRequiredField("firstName"),
    validateRequiredField("lastName"),
    validateRequiredField("middleInitial"),
    validateEmail(),
    validateRequiredField("contactNumber"),
  ];
};

// Middleware to validate form
const validateForm = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  loginValidationRules,
  registerValidationRules,
  validateForm,
  validateEmail,
  validateForgotPassword,
  updateProfileValidation,
  addSubjectValidation,
  addCourseValidation,
  addSchoolYearValidation,
};
