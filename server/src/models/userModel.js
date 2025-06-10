const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const Student = require("./studentModel");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: true,
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
      unique: true,
    },
    role: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "students",
        key: "id",
      },
      onUpdate: "CASCADE", // Allow updating studentId
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

// Associations
User.belongsTo(Student, {
  foreignKey: "studentId", // This is correct
  targetKey: "id",
  as: "student",
});

Student.hasOne(User, {
  foreignKey: "studentId",
  sourceKey: "id",
  as: "user",
  onDelete: "CASCADE",
  hooks: true,
});

module.exports = User;
