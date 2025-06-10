const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Submission = sequelize.define(
  "submissions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    schoolYear: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    semester: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    dateAndTime: {
      type: DataTypes.DATE,
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
  {
    tableName: "submissions",
    timestamps: false, // because you manually handle createdAt/updatedAt
  }
);

module.exports = Submission;
