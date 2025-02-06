const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Instructor = sequelize.define("Instructor", {
  instructorId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Instructor.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Instructor;
