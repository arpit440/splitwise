const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  paid_by: { type: String, required: true },
  participants: [{ type: String }] // optional for advanced splitting
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
