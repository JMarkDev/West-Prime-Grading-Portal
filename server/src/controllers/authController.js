const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const saltsRounds = 10;
const sequelize = require("../config/database");
require("dotenv").config();
const date = require("date-and-time");
const { setTokens } = require("../helpers/tokenHelpers");
const rolesList = require("../constants/rolesList");
const studentModel = require("../models/studentModel");

const handleRegister = async (req, res) => {
  const {
    firstName,
    lastName,
    middleInitial,
    email,
    contactNumber,
    address,
    course,
    yearLevel,
    role,
    password,
  } = req.body;
  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const hashPassword = await bcrypt.hash(password, saltsRounds);

    let studentId = null;
    if (role === rolesList.student) {
      const newStudent = await studentModel.create({
        course,
        yearLevel,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      });

      studentId = newStudent.id;
    }

    await userModel.create({
      firstName,
      lastName,
      middleInitial,
      email,
      contactNumber,
      role,
      address,
      studentId,
      password: hashPassword,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    let roleMessage = "";
    if (role === rolesList.admin) {
      roleMessage = "Admin";
    } else if (role === rolesList.instructor) {
      roleMessage = "Instructor";
    } else {
      roleMessage = "Student";
    }

    return res.status(201).json({
      message: `${roleMessage} added successfully`,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      //  generate tokens
      const tokens = setTokens(res, { email, role: user.role });
      accessToken = tokens.accessToken;

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        role: user.role,
        accessToken: accessToken,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Login error in server" });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ status: "success", message: "Logout successful" });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
};
