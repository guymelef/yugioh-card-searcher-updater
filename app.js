import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'

import { MONGODB_URI } from './utils/config.js'
import { fetchAllData } from './utils/card_updater.js'
import { checkRequestKeyHeader } from './utils/middleware.js'
import { indexRouter } from './controllers/index.js'
import { updateRouter } from './controllers/update.js'



export const app = express()

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Ⓜ️  Connected to MongoDB!')
    await fetchAllData()
  })
  .catch(err => console.log('🟥 MONGODB ERROR:', err.message))

app.use(cors())
app.use('/', checkRequestKeyHeader, indexRouter)
app.use('/api/update', checkRequestKeyHeader, updateRouter)