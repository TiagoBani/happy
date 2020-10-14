import path from 'path'

import express from 'express'
import 'express-async-errors'
import cors from 'cors'

import './database/connection'

import routers from './routes'
import errorHandler from './errors/handler'

const PORT = process.env.NODE_PORT || 3333

const app = express()

app.use(cors())
app.use(express.json())
app.use(routers)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))
