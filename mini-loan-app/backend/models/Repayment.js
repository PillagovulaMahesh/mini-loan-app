const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Repayment extends Model {}

Repayment.init(
  {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID'),
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    modelName: 'Repayment',
    timestamps: true,
  }
);

module.exports = Repayment;
