const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM income WHERE user_id = ? ORDER BY date DESC',
    [req.userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, amount, date, note } = req.body;
  if (!name || !amount || !date)
    return res.status(400).json({ message: 'Missing required fields' });
  const [result] = await pool.query(
    'INSERT INTO income (user_id, name, amount, date, note) VALUES (?,?,?,?,?)',
    [req.userId, name, amount, date, note || null]
  );
  res.status(201).json({ id: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const { name, amount, date, note } = req.body;
  const [result] = await pool.query(
    'UPDATE income SET name=?, amount=?, date=?, note=? WHERE id=? AND user_id=?',
    [name, amount, date, note || null, req.params.id, req.userId]
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM income WHERE id=? AND user_id=?', [
    req.params.id,
    req.userId
  ]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;