import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'

import { MONGODB_URI } from './utils/config.js'
import { indexRouter } from './controllers/index.js'
import { updateRouter } from './controllers/update.js'
import { fetchAllData } from './utils/card_updater.js'



export const app = express()

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Ⓜ️  Connected to MongoDB!')
    await fetchAllData()
  })
  .catch(err => console.log('🟥 MONGODB ERROR:', err.message))

app.use(cors())
app.use('/', indexRouter)
app.use('/api/update', updateRouter)