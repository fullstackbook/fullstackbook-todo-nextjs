import { Client } from 'pg'
const connectionString = process.env.DB_URL

const db = new Client({
  connectionString
})
db.connect()

export default db