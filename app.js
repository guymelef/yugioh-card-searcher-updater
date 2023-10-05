import express from 'express'
import cors from 'cors'

import { checkRequestKeyHeader } from './utils/middleware.js'
import { indexRouter } from './controllers/index.js'
import { updateRouter } from './controllers/update.js'
import { searchRouter } from './controllers/search.js'



export const app = express()

app.use(cors())
app.use(checkRequestKeyHeader)
app.use(express.json())
app.use('/', indexRouter)
app.use('/api/update', updateRouter)
app.use('/api/search', searchRouter)