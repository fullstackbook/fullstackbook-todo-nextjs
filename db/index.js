const { Client } = require('pg')
const connectionString = process.env.DB_URL

const db = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})
db.connect()

export default db