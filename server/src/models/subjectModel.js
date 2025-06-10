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
      type: DataTypes.STRING(55),
      allowNull: true,
    },
    units: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
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
  { timestamps: false, indexes: [{ unique: true, fields: ["subjectCode"] }] }
);

module.exports = Subjects;
