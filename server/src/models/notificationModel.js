const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./userModel");

const Notification = sequelize.define(
  "notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    is_read: {
      type: DataTypes.TINYINT(0),
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
    timestamps: false,
  }
);

User.hasMany(Notification, { foreignKey: "user_id", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

module.exports = Notification;
