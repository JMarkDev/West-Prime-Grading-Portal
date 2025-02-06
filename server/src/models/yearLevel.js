const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const YearLevel = sequelize.define(
  "year_levels",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    yearLevel: {
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

module.exports = YearLevel;
