const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { search, category, status, from, to } = req.query;
  let sql = 'SELECT * FROM bills WHERE user_id = ?';
  const params = [req.userId];

  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (from) { sql += ' AND due_date >= ?'; params.push(from); }
  if (to) { sql += ' AND due_date <= ?'; params.push(to); }

  if (status === 'paid') sql += " AND status = 'paid'";
  else if (status === 'unpaid') sql += " AND status = 'unpaid' AND due_date >= CURDATE()";
  else if (status === 'overdue') sql += " AND status = 'unpaid' AND due_date < CURDATE()";

  sql += ' ORDER BY due_date ASC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, amount, category, due_date, recurring, note } = req.body;
  if (!name || !amount || !category || !due_date)
    return res.status(400).json({ message: 'Missing required fields' });
  const [result] = await pool.query(
    'INSERT INTO bills (user_id, name, amount, category, due_date, recurring, note) VALUES (?,?,?,?,?,?,?)',
    [req.userId, name, amount, category, due_date, recurring || 'one-time', note || null]
  );
  res.status(201).json({ id: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { name, amount, category, due_date, recurring, note, status } = req.body;
  const [result] = await pool.query(
    'UPDATE bills SET name=?, amount=?, category=?, due_date=?, recurring=?, note=?, status=? WHERE id=? AND user_id=?',
    [name, amount, category, due_date, recurring, note || null, status || 'unpaid', req.params.id, req.userId]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Updated' });
});

router.put('/:id/pay', async (req, res) => {
  const [result] = await pool.query(
    "UPDATE bills SET status='paid' WHERE id=? AND user_id=?",
    [req.params.id, req.userId]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Marked as paid' });
});

router.delete('/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM bills WHERE id=? AND user_id=?', [
    req.params.id,
    req.userId
  ]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;