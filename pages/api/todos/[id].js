import db from "../../../db";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const result = await db.query('UPDATE todos SET name = $1, completed = $2 WHERE id = $3 RETURNING *', [req.body.name, req.body.completed, req.query.id])
    if (result.rows.length === 0) {
      res.status(404).send('todo not found')
      return
    }
    res.send(result.rows)
  } else if (req.method === 'DELETE') {
    await db.query('DELETE FROM todos WHERE id = $1', [req.query.id])
    res.status(200).send()
  } else {
    const result = await db.query('SELECT * FROM todos WHERE id = $1', [req.query.id])
    if (result.rows.length === 0) {
      res.status(404).send('todo not found')
      return
    }
    res.send(result.rows)
  }
}