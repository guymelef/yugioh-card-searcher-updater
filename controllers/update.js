import { Router } from "express"

import { fetchFromYugipedia } from "../utils/yugipedia.js"
import { saveToDatabase } from "../utils/database.js"
import { checkYgoprodeck, checkYugipedia } from "../utils/update.js"
import { YUGIPEDIA_PAGE, BOT_RD_URL, botRefreshDataRequestOption } from "../config/config.js"



export const updateRouter = Router()

updateRouter.get('/:src', (req, res) => {
  const source = req.params.src
  if (!["ygoprodeck", "yugipedia"].includes(source)) return res.status(403).end()
  
  const updateSources = { 'ygoprodeck': checkYgoprodeck, 'yugipedia': checkYugipedia }
  const updateMark = source === "ygoprodeck" ? '🔸' : '🔹'
  const updateMarkLength = source === "ygoprodeck" ? 14 : 26
  const checkSource = updateSources[source]
  console.log(`\n${updateMark.repeat(updateMarkLength)}`)
  checkSource()
    .then(async (cards) => {
      if (cards.length) {
        let newCards = []
        if (source === 'ygoprodeck') newCards = await fetchFromYugipedia(null, cards, null)
        else newCards = await fetchFromYugipedia(cards, null, null)
        console.log(`📢 [${newCards.length}] NEW CARD(S) FOUND!\n${updateMark.repeat(updateMarkLength)}\n`)

        await saveToDatabase(newCards)
        fetch(BOT_RD_URL, botRefreshDataRequestOption)
          .then(res => res.json())
          .then(json => console.log("🤖 BOT RESPONSE:", json))
          .catch(err => console.log("🟥 BOT DATA REFRESH ERROR:", err))
        
        res.json({
          source,
          message: `${cards.length} new card(s) found!`,
          newCards: newCards.map(card => ({
            name: card.name,
            page: `${YUGIPEDIA_PAGE}${card.pageId}`
          })),
          timestamp: new Date().toLocaleString('en-ph')
        })
      } else {
        console.log(`💯 CARD DB IS UP TO DATE!\n${updateMark.repeat(updateMarkLength)}\n`)
        res.json({
          source,
          message: "check finished, no new card(s) found",
          timestamp: new Date().toLocaleString('en-ph')
        })
      }
    })
    .catch(err => res.json({ error: err.message }))
})