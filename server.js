const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenses');
const settlementRoutes = require('./routes/settlements');



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/expenses', expenseRoutes);
app.use('/', settlementRoutes);

// Routes
app.get('/', (req, res) => res.send('Split App API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
