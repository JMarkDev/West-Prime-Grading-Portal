"use strict";
const date = require("date-and-time");
const sequelize = require("../config/database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     *
     */
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    await queryInterface.bulkInsert(
      "subjects",
      [
        {
          id: 1,
          subjectCode: "IT 101",
          units: 3,
          description: "Introduction to Information Technology",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 2,
          subjectCode: "IT 102",
          units: 3,
          description: "Web Development",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 3,
          subjectCode: "IT 103",
          units: 3,
          description: "Database Management",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 4,
          subjectCode: "IT 104",
          units: 3,
          description: "Network and Security",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 5,
          subjectCode: "IT 105",
          units: 3,
          description: "Operating Systems",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 6,
          subjectCode: "IT 106",
          units: 3,
          description: "Software Engineering",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 7,
          subjectCode: "IT 107",
          units: 3,
          description: "Mobile Development",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 8,
          subjectCode: "IT 108",
          units: 3,
          description: "Data Science",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 9,
          subjectCode: "IT 109",
          units: 3,
          description: "Artificial Intelligence",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 10,
          subjectCode: "IT 110",
          units: 3,
          description: "Cloud Computing",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("subjects", null, {});
  },
};
