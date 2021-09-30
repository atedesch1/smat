import express from 'express'
import cors from 'cors'
import path from 'path'
import 'reflect-metadata'

import router from './routes'
import connectDatabase from './database/connect'

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

app.use(express.static(path.join(__dirname, '../build')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

export async function init () {
  await connectDatabase()
}

export default app
