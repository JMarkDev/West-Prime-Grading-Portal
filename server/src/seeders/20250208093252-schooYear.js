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
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    await queryInterface.bulkInsert("school_years", [
      {
        id: 1,
        schoolYear: "2020-2021",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        schoolYear: "2021-2022",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        schoolYear: "2022-2023",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        schoolYear: "2023-2024",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 5,
        schoolYear: "2024-2025",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 6,
        schoolYear: "2025-2026",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 7,
        schoolYear: "2026-2027",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 8,
        schoolYear: "2027-2028",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 9,
        schoolYear: "2028-2029",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 10,
        schoolYear: "2029-2030",
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
  },
};
