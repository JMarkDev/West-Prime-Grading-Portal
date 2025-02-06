const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Subjects = sequelize.define(
  "subjects",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subjectCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    units: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Subjects;
