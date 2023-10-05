import { Router } from "express"

import { fetchFromYugipedia } from "../utils/card_creator.js"
import { saveToDatabase } from "../utils/database_updater.js"



export const searchRouter = Router()

searchRouter.post('/', async (req, res) => {
  const body = req.body
  const cardToSearchFor = body.card
  const card = await fetchFromYugipedia(null, null, cardToSearchFor)

  let category = ''
  if (card.length) {
    category = card[0].category
    await saveToDatabase(card)
  }

  console.log("RESULT:", `[ ${card.length} ] card found`)
  res.json({ match: card.length === 1, category })
})