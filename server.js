import mongoose from "mongoose"
import http from "http"

import { app } from "./app.js"
import { fetchAllData } from "./utils/update_checker.js"
import { MONGODB_URI, HOST, PORT } from "./utils/config.js"


const server = http.createServer(app)
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Ⓜ️  Connected to MongoDB!')
    await fetchAllData()
    server.listen(PORT, () => console.log(`🚀 THE SERVER IS UP AT: ${HOST}:${PORT}`))
  })
  .catch(err => console.log('🟥 MONGODB ERROR:', err.message))