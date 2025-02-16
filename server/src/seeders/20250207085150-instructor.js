"use strict";
const date = require("date-and-time");
const sequelize = require("../config/database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     *    */
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    await queryInterface.bulkInsert(
      "instructors",
      [
        {
          id: 8,
          department: "IT",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 9,
          department: "IT",
          createdAt: sequelize.literal(`'${formattedDate}'`),
        },
        {
          id: 10,
          department: "IT",
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
  },
};
