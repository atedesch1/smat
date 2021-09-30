import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import path from 'path'

const app = express()

const dbString = process.env.DATABASE_URL
const sslObject = process.env.NODE_ENV === 'development' ? null : { rejectUnauthorized: false }

const pool = new Pool({
  connectionString: dbString,
  ssl: sslObject
})

const connectWithRetry = () => {
  pool
    .connect()
    .then(() => console.log('Successfully connected to DB'))
    .catch((e) => {
      console.log(`${process.env.NODE_ENV === 'development'}`)
      console.log('Couldn\'t connect to DB, retrying in 5s...')
      console.log(e)
      setTimeout(connectWithRetry, 10000)
    })
}

connectWithRetry()

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../build')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

app.get('/api/', async (req, res) => {
  try {
    res.json('Its working')
  } catch (err) {
    console.error(err.message)
  }
})

app.post('/api/testpost', async (req, res) => {
  try {
    const { text } = req.body
    const newTest = await pool.query('INSERT INTO test (text) VALUES ($1)', [text])
    res.json(newTest.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/api/testget', async (req, res) => {
  try {
    const tests = await pool.query('SELECT * FROM test')
    res.json(tests.rows)
  } catch (err) {
    console.error(err.message)
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`NodeApp listening on http://localhost:${PORT}`) })
