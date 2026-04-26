/*******************************************************************************
 * @Author                : rudito-github<rudi.neuss@t-online.de>              *
 * @CreatedDate           : 2026-04-26 12:22:09                                *
 * @LastEditors           : rudito-github<rudi.neuss@t-online.de>              *
 * @LastEditDate          : 2026-04-26 12:22:14                                *
 * @FilePath              : Online-speisplan/Backend-kantine/src/routes/crud.js*
 * @CopyRight             : MerBleueAviation                                   *
 ******************************************************************************/
const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all rows from a table
// Usage: GET /api/:table
router.get('/:table', async (req, res) => {
  const { table } = req.params
  try {
    const result = await pool.query(
      `SELECT * FROM "${table}" ORDER BY dish_date ASC, price ASC`,
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single row by id
// Usage: GET /api/:table/:id
router.get('/:table/:id', async (req, res) => {
  const { table, id } = req.params
  try {
    const result = await pool.query(`SELECT * FROM "${table}" WHERE id = $1`, [
      id,
    ])
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create new row
// Usage: POST /api/:table  body: { col: val, ... }
router.post('/:table', async (req, res) => {
  const { table } = req.params
  const data = req.body
  const keys = Object.keys(data)
  const values = Object.values(data)

  if (keys.length === 0)
    return res.status(400).json({ error: 'No data provided' })

  const cols = keys.map((k) => `"${k}"`).join(', ')
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')

  try {
    const result = await pool.query(
      `INSERT INTO "${table}" (${cols}) VALUES (${placeholders}) RETURNING *`,
      values,
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update row by id
// Usage: PUT /api/:table/:id  body: { col: val, ... }
router.put('/:table/:id', async (req, res) => {
  const { table, id } = req.params
  const data = req.body
  const keys = Object.keys(data)
  const values = Object.values(data)

  if (keys.length === 0)
    return res.status(400).json({ error: 'No data provided' })

  const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')

  try {
    const result = await pool.query(
      `UPDATE "${table}" SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE row by id
// Usage: DELETE /api/:table/:id
router.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params
  try {
    const result = await pool.query(
      `DELETE FROM "${table}" WHERE id = $1 RETURNING *`,
      [id],
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Not found' })
    res.json({ message: 'Deleted', row: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
