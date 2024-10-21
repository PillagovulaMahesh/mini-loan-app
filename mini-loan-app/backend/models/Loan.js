const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Repayment = require('./repayment');

class Loan extends Model {}

Loan.init(
  {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }, // At least one repayment
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'PAID'),
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    modelName: 'Loan',
    timestamps: true,
  }
);

// Define the relationship between Loan and Repayment
Loan.hasMany(Repayment, { as: 'repayments', foreignKey: 'loanId' });
Repayment.belongsTo(Loan, { foreignKey: 'loanId' });

module.exports = Loan;
