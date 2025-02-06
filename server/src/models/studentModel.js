const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yearLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Student.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Student;
