const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const studentModel = require("./studentModel");
const instructorModel = require("./instructorModel");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    middleInitial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    role: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // status: {
    //   type: DataTypes.TINYINT(1),
    //   allowNull: false,
    // },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "students",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "instructors",
        key: "id",
      },
      onDelete: "CASCADE",
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

User.hasOne(studentModel, { foreignKey: "studentId", onDelete: "CASCADE" });
studentModel.belongsTo(User, { foreignKey: "studentId", onDelete: "CASCADE" });

User.hasOne(instructorModel, { foreignKey: "userId", onDelete: "CASCADE" });
instructorModel.belongsTo(User, { foreignKey: "userId" });

module.exports = User;
