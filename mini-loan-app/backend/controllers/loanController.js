const { Loan, Repayment } = require('../models');

// Create a New Loan
exports.createLoan = async (req, res) => {
  const { amount, term } = req.body;

  try {
    const loan = await Loan.create({ amount, term, userId: req.user.id });

    // Generate scheduled repayments (weekly)
    const weeklyAmount = (amount / term).toFixed(2);
    const repayments = Array.from({ length: term }).map((_, i) => ({
      loanId: loan.id,
      amount: i === term - 1 ? (amount - weeklyAmount * (term - 1)).toFixed(2) : weeklyAmount,
      dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
    }));

    await Repayment.bulkCreate(repayments);

    res.status(201).json({ message: 'Loan created successfully', loan });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Approve Loan (Admin Only)
exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.status = 'APPROVED';
    await loan.save();
    res.json({ message: 'Loan approved', loan });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Get All Loans for Logged-in User
exports.getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({ where: { userId: req.user.id } });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
