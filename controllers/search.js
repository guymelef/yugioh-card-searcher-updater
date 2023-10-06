import { Router } from "express"
import { Redis } from "ioredis"

import { REDIS_URI } from "../utils/config.js"
import { getCardInfo } from "../utils/cardinfo_creator.js"
import { fetchFromYugipedia } from "../utils/card_creator.js"
import { saveToDatabase } from "../utils/database_updater.js"



export const searchRouter = Router()

searchRouter.post('/', async (req, res) => {
  const body = req.body
  const cardToSearchFor = body.card.toLowerCase().replace(/ +/g, ' ').trim()
  const card = await fetchFromYugipedia(null, null, cardToSearchFor)

  const normalizeString = (string) => {
    return string
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\s\w:!/@&?#=%\[\]]|[_☆★]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  let cardToSend = {}
  if (card.length) {
    cardToSend = { ...card[0] }
    await saveToDatabase(card)

    const redis = new Redis(REDIS_URI)
    redis.on('connect', async () => {
      console.log("🧲 REDIS connection established")
      const prefix = cardToSend.category === "rush" ? 'searchr' : 'search'
      const messagePrefix = cardToSend.category === 'rush' ? '🚀' : '🎴'
      const responseMessage = `${messagePrefix} ${getCardInfo(cardToSend)}`

      const isShort = responseMessage.length <= 500
      const key = `${prefix}:${normalizeString(cardToSearchFor)}`
      const value = JSON.stringify({ short: isShort, result: responseMessage })

      try {
        await redis.set(key, value)
        console.log("💽 SAVED TO REDIS!")
        redis.quit()
      } catch (err) {
        console.log("⚠️ REDIS SET ERROR:", err)
      }
    })
  }
  console.log("RESULT:", `[ ${card.length} ] card found`)
  
  res.json({ match: card.length === 1, card: cardToSend })
})