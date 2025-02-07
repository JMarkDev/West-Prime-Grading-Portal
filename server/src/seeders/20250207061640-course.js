"use strict";

const date = require("date-and-time");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // UTC format

    await queryInterface.bulkInsert("courses", [
      {
        id: 1,
        courseCode: "BSIT",
        courseName: "Bachelor of Science in Information Technology",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 2,
        courseCode: "BSIS",
        courseName: "Bachelor of Science in Information Systems",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 3,
        courseCode: "BSCS",
        courseName: "Bachelor of Science in Computer Science",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 4,
        courseCode: "BSCE",
        courseName: "Bachelor of Science in Computer Engineering",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 5,
        courseCode: "BSA",
        courseName: "Bachelor of Science in Accountancy",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 6,
        courseCode: "BSBA",
        courseName: "Bachelor of Science in Business Administration",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 7,
        courseCode: "BSHRM",
        courseName: "Bachelor of Science in Hotel and Restaurant Management",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 8,
        courseCode: "BSN",
        courseName: "Bachelor of Science in Nursing",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 9,
        courseCode: "BSED",
        courseName: "Bachelor of Science in Education",
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
      {
        id: 10,
        courseCode: "BSARCH",
        courseName: "Bachelor of Science in Architecture", // Fixed duplicate BSA
        createdAt: formattedDate,
        updatedAt: formattedDate,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("courses", null, {});
  },
};
