const Expense = require('../models/Expense');

// @desc    Add new expense
// @route   POST /expenses
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, paid_by, participants } = req.body;

    if (amount == null || description == null || paid_by == null || !participants) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ success: false, message: 'Description must not be empty' });
    }

    if (typeof paid_by !== 'string' || paid_by.trim() === '') {
      return res.status(400).json({ success: false, message: 'Paid_by must not be empty' });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one participant is required' });
    }

    const expense = await Expense.create({ amount, description, paid_by, participants });

    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense added successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get all expenses
// @route   GET /expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ success: true, data: updated, message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Delete an expense
// @route   DELETE /expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
