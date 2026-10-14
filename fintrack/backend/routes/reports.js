const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/by-category', async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();
  const [rows] = await pool.query(
    `SELECT category, SUM(amount) AS total FROM expenses
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?
     GROUP BY category ORDER BY total DESC`,
    [req.userId, month, year]
  );
  res.json(rows);
});

router.get('/monthly-trend', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT YEAR(date) AS year, MONTH(date) AS month, SUM(amount) AS total
     FROM expenses WHERE user_id=?
     GROUP BY YEAR(date), MONTH(date)
     ORDER BY year DESC, month DESC LIMIT 6`,
    [req.userId]
  );
  res.json(rows.reverse());
});

router.get('/income-vs-expenses', async (req, res) => {
  const [inc] = await pool.query(
    `SELECT YEAR(date) AS year, MONTH(date) AS month, SUM(amount) AS total
     FROM income WHERE user_id=? GROUP BY year, month ORDER BY year DESC, month DESC LIMIT 6`,
    [req.userId]
  );
  const [exp] = await pool.query(
    `SELECT YEAR(date) AS year, MONTH(date) AS month, SUM(amount) AS total
     FROM expenses WHERE user_id=? GROUP BY year, month ORDER BY year DESC, month DESC LIMIT 6`,
    [req.userId]
  );
  res.json({ income: inc.reverse(), expenses: exp.reverse() });
});

router.get('/summary', async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const [[{ income }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS income FROM income
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?`,
    [req.userId, month, year]
  );
  const [[{ expenses }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS expenses FROM expenses
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?`,
    [req.userId, month, year]
  );
  const [[{ bills }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS bills FROM bills
     WHERE user_id=? AND MONTH(due_date)=? AND YEAR(due_date)=? AND status='unpaid'`,
    [req.userId, month, year]
  );
  const [[{ expenseCount }]] = await pool.query(
    `SELECT COUNT(*) AS expenseCount FROM expenses
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?`,
    [req.userId, month, year]
  );
  const [[{ billCount }]] = await pool.query(
    `SELECT COUNT(*) AS billCount FROM bills
     WHERE user_id=? AND MONTH(due_date)=? AND YEAR(due_date)=?`,
    [req.userId, month, year]
  );
  const [[{ paidBills }]] = await pool.query(
    `SELECT COUNT(*) AS paidBills FROM bills
     WHERE user_id=? AND MONTH(due_date)=? AND YEAR(due_date)=? AND status='paid'`,
    [req.userId, month, year]
  );
  const [[{ unpaidBills }]] = await pool.query(
    `SELECT COUNT(*) AS unpaidBills FROM bills
     WHERE user_id=? AND MONTH(due_date)=? AND YEAR(due_date)=? AND status='unpaid'`,
    [req.userId, month, year]
  );

  const [topCat] = await pool.query(
    `SELECT category, SUM(amount) AS total FROM expenses
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?
     GROUP BY category ORDER BY total DESC LIMIT 1`,
    [req.userId, month, year]
  );

  res.json({
    month, year,
    income, expenses, bills,
    remaining: income - expenses - bills,
    expenseCount, billCount, paidBills, unpaidBills,
    highestCategory: topCat[0] || null
  });
});

router.get('/dashboard', async (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [[{ totalIncome }]] = await pool.query(
    'SELECT COALESCE(SUM(amount),0) AS totalIncome FROM income WHERE user_id=?',
    [req.userId]
  );
  const [[{ totalExpenses }]] = await pool.query(
    'SELECT COALESCE(SUM(amount),0) AS totalExpenses FROM expenses WHERE user_id=?',
    [req.userId]
  );
  const [[{ monthlyIncome }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS monthlyIncome FROM income
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?`,
    [req.userId, month, year]
  );
  const [[{ monthlyExpenses }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS monthlyExpenses FROM expenses
     WHERE user_id=? AND MONTH(date)=? AND YEAR(date)=?`,
    [req.userId, month, year]
  );
  const [[{ upcomingBills }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS upcomingBills FROM bills
     WHERE user_id=? AND status='unpaid' AND due_date >= CURDATE()`,
    [req.userId]
  );
  const [[{ unpaidAllBills }]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS unpaidAllBills FROM bills
     WHERE user_id=? AND status='unpaid'`,
    [req.userId]
  );

  const [budgetRows] = await pool.query(
    'SELECT monthly_limit FROM budget WHERE user_id=? AND month=? AND year=?',
    [req.userId, month, year]
  );
  const monthlyLimit = budgetRows[0]?.monthly_limit || 0;

  const [recentExpenses] = await pool.query(
    'SELECT * FROM expenses WHERE user_id=? ORDER BY date DESC, id DESC LIMIT 5',
    [req.userId]
  );

  const [upcomingBillsList] = await pool.query(
    `SELECT * FROM bills WHERE user_id=? AND status='unpaid' ORDER BY due_date ASC LIMIT 5`,
    [req.userId]
  );

  res.json({
    totalBalance: totalIncome - totalExpenses - unpaidAllBills,
    monthlyIncome,
    monthlyExpenses,
    upcomingBills,
    monthlyBudget: monthlyLimit,
    remainingBudget: monthlyLimit - monthlyExpenses,
    recentExpenses,
    upcomingBillsList
  });
});

module.exports = router;