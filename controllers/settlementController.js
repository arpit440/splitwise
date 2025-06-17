const Expense = require('../models/Expense');

// Helper: Get net balances
const calculateNetBalances = async () => {
  const expenses = await Expense.find();
  const balances = {};

  expenses.forEach(exp => {
    const share = exp.amount / exp.participants.length;

    exp.participants.forEach(person => {
      if (!balances[person]) balances[person] = 0;
      balances[person] -= share;
    });

    if (!balances[exp.paid_by]) balances[exp.paid_by] = 0;
    balances[exp.paid_by] += exp.amount;
  });

  return balances;
};

// @route   GET /balances
exports.getBalances = async (req, res) => {
  try {
    const balances = await calculateNetBalances();
    res.json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /people
exports.getPeople = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const people = new Set();

    expenses.forEach(exp => {
      people.add(exp.paid_by);
      exp.participants.forEach(p => people.add(p));
    });

    res.json({ success: true, data: [...people] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /settlements
exports.getSettlements = async (req, res) => {
  try {
    const balances = await calculateNetBalances();
    const settlements = [];

    const debtors = [];
    const creditors = [];

    for (const [person, balance] of Object.entries(balances)) {
      if (balance < -0.01) debtors.push({ person, balance }); // owes
      else if (balance > 0.01) creditors.push({ person, balance }); // to be paid
    }

    // Simplify transactions
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const owe = Math.min(Math.abs(debtors[i].balance), creditors[j].balance);
      settlements.push({
        from: debtors[i].person,
        to: creditors[j].person,
        amount: parseFloat(owe.toFixed(2))
      });

      debtors[i].balance += owe;
      creditors[j].balance -= owe;

      if (Math.abs(debtors[i].balance) < 0.01) i++;
      if (Math.abs(creditors[j].balance) < 0.01) j++;
    }

    res.json({ success: true, data: settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
