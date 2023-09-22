import { Router } from "express"

import { fetchFromYugipedia } from "../utils/card_creator.js"
import { saveToDatabase, refreshBotData } from "../utils/database_updater.js"
import { checkYgoprodeck, checkYugipedia } from "../utils/update_checker.js"
import { YUGIPEDIA_PAGE } from "../utils/config.js"



export const updateRouter = Router()

updateRouter.get('/:src', (req, res) => {
  const updateSources = { 'ygoprodeck': checkYgoprodeck, 'yugipedia': checkYugipedia }
  const source = req.params.src
  const checkSource = updateSources[source]

  checkSource()
    .then(async (cards) => {
      if (cards.length) {
        let newCards = []
        if (source === 'ygoprodeck') newCards = await fetchFromYugipedia(null, cards)
        else newCards = await fetchFromYugipedia(cards, null)

        await saveToDatabase(newCards)
        refreshBotData()
        
        console.log(`⭐ NEW CARD(S) [${cards.length}] SAVED!\n`)
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