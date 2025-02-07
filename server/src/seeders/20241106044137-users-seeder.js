"use strict";

const bcrypt = require("bcryptjs");
const saltsRounds = 10;
const rolesList = require("../constants/rolesList");
const statusList = require("../constants/statusList");
const date = require("date-and-time");
const sequelize = require("../config/database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     *
     */

    // Generate hashed password
    const hashPassword = await bcrypt.hash("password", saltsRounds);

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        firstName: "Admin",
        lastName: "0",
        middleInitial: "M",
        email: "admin@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.admin,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        firstName: "Admin ",
        lastName: "1",
        middleInitial: "M",
        email: "admin1@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.admin,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        firstName: "Student",
        lastName: "1",
        middleInitial: "M",
        email: "student1@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.student,
        studentId: 3,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        firstName: "Student",
        lastName: "2",
        middleInitial: "M",
        email: "student2@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.student,
        studentId: 4,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 5,
        firstName: "Student",
        lastName: "3",
        middleInitial: "M",
        email: "student3@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.student,
        studentId: 5,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 6,
        firstName: "Student",
        lastName: "4",
        middleInitial: "M",
        email: "student4@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.student,
        studentId: 6,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 7,
        firstName: "Student",
        lastName: "5",
        middleInitial: "M",
        email: "student5@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.student,
        studentId: 7,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 8,
        firstName: "Instructor",
        lastName: "1",
        middleInitial: "A",
        email: "instructor1@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.instructor,
        instructorId: 8,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 9,
        firstName: "Instructor",
        lastName: "2",
        middleInitial: "A",
        email: "instructor2@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.instructor,
        instructorId: 9,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 10,
        firstName: "Instructor",
        lastName: "3",
        middleInitial: "A",
        email: "instructor2@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.instructor,
        instructorId: 10,
        password: hashPassword,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("users", null, {});
  },
};
