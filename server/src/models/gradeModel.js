const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Grade = sequelize.define(
  "grades",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentName: {
      type: DataTypes.STRING(55),
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectCode: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instructor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    schoolYear: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    course: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    yearLevel: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Grade;
