// Simple Expense Manager Backend (Express + MySQL)

// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // To read JSON body

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',  // <-- your password
  database: 'expense_app'
});

db.connect(err => {
  if (err) console.log(err);
  else console.log('✅ MySQL Connected');
});

// ➕ Add expense
app.post('/add', (req, res) => {
  const { amount, category, description, date } = req.body;
  const sql = 'INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)';
  db.query(sql, [amount, category, description, date], (err) => {
    if (err) res.status(500).send(err);
    else res.send('Expense added!');
  });
});

// 📋 Get all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) res.status(500).send(err);
    else res.json(results);
  });
});

// ✏️ Update expense
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;
  const sql = 'UPDATE expenses SET amount=?, category=?, description=?, date=? WHERE id=?';
  db.query(sql, [amount, category, description, date, id], (err) => {
    if (err) res.status(500).send(err);
    else res.send('Expense updated!');
  });
});

// ❌ Delete expense
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM expenses WHERE id=?';
  db.query(sql, [id], (err) => {
    if (err) res.status(500).send(err);
    else res.send('Expense deleted!');
  });
});

// Start the server
app.listen(4000, () => console.log('🚀 Server running on port 4000'));
