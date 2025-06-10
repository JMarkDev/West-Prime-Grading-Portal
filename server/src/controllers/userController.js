const { Op } = require("sequelize");
const userModel = require("../models/userModel");
const { createdAt } = require("../utils/formattedTime");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const statusList = require("../constants/statusList");
const saltsRounds = 10;
const otpController = require("./otpController");
const studentModel = require("../models/studentModel");
const rolesList = require("../constants/rolesList");
const sequelize = require("../config/database");
const date = require("date-and-time");
const gradeModel = require("../models/gradeModel");

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({
      where: {
        id: id,
      },
      include: [{ model: studentModel, required: false, as: "student" }],
    });

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// const getAllUserByRole = async (req, res) => {
//   const { role } = req.query;
//   try {
//     const verifiedUser = await userModel.findAll({
//       where: {
//         role: role,
//       },
//     });

//     console.log(verifiedUser);

//     return res.status(200).json(verifiedUser);
//   } catch (error) {
//     return res.status(500).json({ Error: "Get all users error in server" });
//   }
// };

const getAllUserByRole = async (req, res) => {
  const { role } = req.query;
  try {
    const verifiedUser = await userModel.findAll({
      where: {
        role: role,
      },
    });
    // Add grade submission status for instructors only
    if (Number(role) === rolesList.instructor) {
      // Process each instructor to add grade submission status
      const instructorsWithStatus = await Promise.all(
        verifiedUser.map(async (instructor) => {
          const instructorData = instructor.toJSON();

          // Get the latest academic record for this instructor
          const latestRecord = await getLatestAcademicRecord(instructor.id);

          if (latestRecord) {
            // Add status information to the instructor
            instructorData.gradeStatus = {
              schoolYear: latestRecord.schoolYear,
              semester: latestRecord.semester,
              status: determineGradeSubmissionStatus(latestRecord.subjects),
              totalSubjects: latestRecord.subjects.length,
              submittedSubjects: latestRecord.subjects.filter(
                (s) => s.grade !== null
              ).length,
            };
          } else {
            // No academic records found
            instructorData.gradeStatus = {
              status: "pending",
              totalSubjects: 0,
              submittedSubjects: 0,
            };
          }

          return instructorData;
        })
      );
      console.log(instructorsWithStatus);

      return res.status(200).json(instructorsWithStatus);
    }

    // For non-instructor roles, return data as is
    return res.status(200).json(verifiedUser);
  } catch (error) {
    return res.status(500).json({ Error: "Get all users error in server" });
  }
};

// Helper function to get the latest academic record for an instructor
const getLatestAcademicRecord = async (instructorId) => {
  try {
    const subjects = await gradeModel.findAll({
      where: { instructorId: Number(instructorId) },
      order: [
        ["schoolYear", "DESC"],
        ["semester", "ASC"], // Assuming "1st" comes before "2nd" in alphabetical order
        ["createdAt", "ASC"],
      ],
    });

    if (!subjects.length) {
      return null;
    }

    // Group subjects by school year and semester
    const groupedSubjects = subjects.reduce((acc, subject) => {
      const key = `${subject.schoolYear} - ${subject.semester}`;

      if (!acc[key]) {
        acc[key] = {
          schoolYear: subject.schoolYear,
          semester: subject.semester,
          subjects: [],
        };
      }

      // Ensure unique subjects
      const existingSubjectIds = new Set(
        acc[key].subjects.map((s) => s.subjectId)
      );

      if (!existingSubjectIds.has(subject.subjectId)) {
        acc[key].subjects.push({
          id: subject.id,
          subjectId: subject.subjectId,
          subjectCode: subject.subjectCode,
          description: subject.description,
          course: subject.course,
          instructor: subject.instructor,
          grade: subject.grade,
          remarks: subject.remarks,
        });
      }

      return acc;
    }, {});

    // Convert to array and get the first one (latest)
    const academicRecords = Object.values(groupedSubjects);
    return academicRecords.length > 0 ? academicRecords[0] : null;
  } catch (error) {
    console.error("Error getting latest academic record:", error);
    return null;
  }
};

// Helper function to determine grade submission status
const determineGradeSubmissionStatus = (subjects) => {
  if (!subjects || !subjects.length) return "pending";

  const totalSubjects = subjects.length;
  const gradedSubjects = subjects.filter(
    (subject) => subject.grade !== null
  ).length;

  if (gradedSubjects === 0) return "pending";
  return "completed";
};

const getUserByRole = async (req, res) => {
  const { role } = req.query;

  try {
    const user = await userModel.findAll({
      where: {
        role: role,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ Error: "Get user by role error in server" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    // Then delete the user
    await userModel.destroy({ where: { id } });

    return res.status(200).json({
      status: "success",
      message: "Deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ Error: "Delete user error in server" });
  }
};

const searchUser = async (req, res) => {
  const { name, role } = req.params;

  try {
    const searchCriteria = {
      where: {
        role: role,
        [Op.or]: [
          { firstName: { [Op.like]: `${name}%` } },
          { lastName: { [Op.like]: `${name}%` } },
        ],
      },
    };
    const users = await userModel.findAll(searchCriteria);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Search user error in server" });
  }
};

const updateUserData = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    middleInitial,
    email,
    contactNumber,
    address,
    course,
    yearLevel,
    schoolYear,
    password,
    studentId,
    status,
    section,
  } = req.body;

  try {
    // Fetch the officeId from the userModel
    const user = await userModel.findOne({ where: { id } });
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const hashPassword = await bcrypt.hash(password, saltsRounds);

    await userModel.update(
      {
        firstName: firstName,
        lastName: lastName,
        middleInitial: middleInitial,
        contactNumber: contactNumber,
        address: address,
        email: email,
        password: hashPassword,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { id },
      }
    );

    if (user.role === rolesList.student) {
      await studentModel.update(
        {
          studentId: studentId,
          course: course,
          yearLevel: yearLevel,
          schoolYear: schoolYear,
          status: status,
          section: section,
          updatedAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          where: { id: user.studentId },
        }
      );
    }

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    if (!newPassword) {
      return res.status(404).json({ message: "Password is required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and Confirm password do not match" });
    }

    const hashPassword = await bcrypt.hash(newPassword, saltsRounds);

    await userModel.update(
      {
        password: hashPassword,
        updatedAt: createdAt,
      },
      {
        where: { email },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    image,
    firstName,
    lastName,
    middleInitial,
    contactNumber,
    email,
    address,
  } = req.body;

  console.log(req.body);

  try {
    const user = await userModel.findOne({ where: { id } });
    // upload image
    let newFileName = null;
    if (req.file) {
      let filetype = req.file.mimetype.split("/")[1];
      newFileName = req.file.filename + "." + filetype;
      fs.rename(
        `./uploads/${req.file.filename}`,
        `./uploads/${newFileName}`,
        async (err) => {
          if (err) throw err;
          console.log("uploaded successfully");
        }
      );
    }

    await userModel.update(
      {
        image: newFileName ? `/uploads/${newFileName}` : user.image,
        firstName: firstName,
        lastName: lastName,
        middleInitial: middleInitial,
        contactNumber: contactNumber,
        email: email,
        address: address,
        updatedAt: createdAt,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existUser = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (existUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    await otpController.postOTP(email);
    return res.status(200).json({
      status: "success",
      message: `Verification OTP sent to ${email}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const user = await userModel.findByPk(id);

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(404).json({ message: "Password is required" });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and Confirm password do not match",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, saltsRounds);

    await userModel.update(
      {
        password: hashPassword,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // getUserByEmail,
  getUserById,
  getAllUserByRole,
  getUserByRole,
  deleteUser,
  searchUser,
  updateUserData,
  forgotPassword,
  updateProfile,
  updateEmail,
  updatePassword,
};
