import { Router } from "express"

import { fetchFromYugipedia } from "../utils/card_creator.js"
import { saveToDatabase } from "../utils/database_updater.js"
import { checkYgoprodeck, checkYugipedia } from "../utils/update_checker.js"
import { YUGIPEDIA_PAGE, BOT_RD_URL, botRefreshDataRequestOption } from "../utils/config.js"



export const updateRouter = Router()

updateRouter.get('/:src', (req, res) => {
  const source = req.params.src
  const updateSources = { 'ygoprodeck': checkYgoprodeck, 'yugipedia': checkYugipedia }

  if (!["ygoprodeck", "yugipedia"].includes(source)) return res.status(403).end()
  
  const checkSource = updateSources[source]
  checkSource()
    .then(async (cards) => {
      if (cards.length) {
        let newCards = []
        if (source === 'ygoprodeck') newCards = await fetchFromYugipedia(null, cards, null)
        else newCards = await fetchFromYugipedia(cards, null, null)
        console.log(`⭐ NEW CARD(S) [${newCards.length}] FOUND!\n`)

        await saveToDatabase(newCards)
        fetch(BOT_RD_URL, botRefreshDataRequestOption)
          .then(res => res.json())
          .then(json => console.log("RESPONSE:", json))
          .catch(err => console.log("BOT DATA REFRESH ERROR:", err))
        
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
        console.log('👍 CARD DB IS UP TO DATE!\n')
        res.json({
          source,
          message: "check finished, no new card(s) found",
          timestamp: new Date().toLocaleString('en-ph')
        })
      }
    })
    .catch(err => res.json({ error: err.message } ))
})