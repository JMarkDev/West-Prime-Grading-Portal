const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Instructor = require("./Instructor");

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Course.belongsTo(Instructor, {
  foreignKey: "instructorId",
  onDelete: "CASCADE",
});

module.exports = Course;
