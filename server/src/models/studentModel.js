const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "students",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schoolYear: {
      type: DataTypes.STRING(20),
      allowNull: true,
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
  {
    timestamps: false,
  }
);

module.exports = Student;
