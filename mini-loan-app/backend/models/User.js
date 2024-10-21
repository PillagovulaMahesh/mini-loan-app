const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Loan = require('./loan');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

// Define the relationship between User and Loan
User.hasMany(Loan, { as: 'loans', foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
