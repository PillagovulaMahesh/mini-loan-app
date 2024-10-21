const { Loan, Repayment } = require('../models');

// Add a Repayment
exports.addRepayment = async (req, res) => {
  const { repaymentId, amount } = req.body;

  try {
    const repayment = await Repayment.findByPk(repaymentId);
    if (!repayment) {
      return res.status(404).json({ message: 'Repayment not found' });
    }

    if (repayment.status === 'PAID') {
      return res.status(400).json({ message: 'Repayment already paid' });
    }

    if (amount < repayment.amount) {
      return res.status(400).json({ message: 'Amount must be greater or equal to scheduled amount' });
    }

    repayment.status = 'PAID';
    await repayment.save();

    // Check if all repayments for the loan are PAID
    const loan = await Loan.findByPk(repayment.loanId, {
      include: { model: Repayment, as: 'repayments' },
    });

    const allPaid = loan.repayments.every((r) => r.status === 'PAID');
    if (allPaid) {
      loan.status = 'PAID';
      await loan.save();
    }

    res.json({ message: 'Repayment successful', repayment });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Get All Repayments for a Loan
exports.getLoanRepayments = async (req, res) => {
  try {
    const repayments = await Repayment.findAll({ where: { loanId: req.params.loanId } });
    res.json(repayments);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
