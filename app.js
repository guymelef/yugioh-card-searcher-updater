import express from 'express'
import cors from 'cors'

import { checkRequestKeyHeader } from './utils/middleware.js'
import { indexRouter } from './controllers/index.js'
import { updateRouter } from './controllers/update.js'



export const app = express()

app.use(cors())
app.use('/', checkRequestKeyHeader, indexRouter)
app.use('/api/update', checkRequestKeyHeader, updateRouter)