const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SchoolYear = sequelize.define(
  "school_years",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    schoolYear: {
      type: DataTypes.STRING,
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

module.exports = SchoolYear;
