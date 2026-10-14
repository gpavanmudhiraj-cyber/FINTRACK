const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const [rows] = await pool.query(
    'SELECT * FROM budget WHERE user_id=? AND month=? AND year=?',
    [req.userId, month, year]
  );
  res.json(rows[0] || { monthly_limit: 0, month, year });
});

router.post('/', async (req, res) => {
  const { monthly_limit, month, year } = req.body;
  if (!monthly_limit || !month || !year)
    return res.status(400).json({ message: 'Missing required fields' });

  await pool.query(
    `INSERT INTO budget (user_id, monthly_limit, month, year)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE monthly_limit = VALUES(monthly_limit)`,
    [req.userId, monthly_limit, month, year]
  );
  res.json({ message: 'Budget saved' });
});

module.exports = router;