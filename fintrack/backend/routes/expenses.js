const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { search, category, from, to, payment_method, min, max } = req.query;
  let sql = 'SELECT * FROM expenses WHERE user_id = ?';
  const params = [req.userId];

  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (payment_method) { sql += ' AND payment_method = ?'; params.push(payment_method); }
  if (from) { sql += ' AND date >= ?'; params.push(from); }
  if (to) { sql += ' AND date <= ?'; params.push(to); }
  if (min) { sql += ' AND amount >= ?'; params.push(min); }
  if (max) { sql += ' AND amount <= ?'; params.push(max); }
  sql += ' ORDER BY date DESC, id DESC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, amount, category, date, payment_method, note } = req.body;
  if (!name || !amount || !category || !date || !payment_method)
    return res.status(400).json({ message: 'Missing required fields' });
  const [result] = await pool.query(
    'INSERT INTO expenses (user_id, name, amount, category, date, payment_method, note) VALUES (?,?,?,?,?,?,?)',
    [req.userId, name, amount, category, date, payment_method, note || null]
  );
  res.status(201).json({ id: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { name, amount, category, date, payment_method, note } = req.body;
  const [result] = await pool.query(
    'UPDATE expenses SET name=?, amount=?, category=?, date=?, payment_method=?, note=? WHERE id=? AND user_id=?',
    [name, amount, category, date, payment_method, note || null, req.params.id, req.userId]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM expenses WHERE id=? AND user_id=?', [
    req.params.id,
    req.userId
  ]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;