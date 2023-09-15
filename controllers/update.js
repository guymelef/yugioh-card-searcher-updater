import { Router } from "express"
import { fetchFromYugipedia } from "../utils/yugipedia.js"
import { saveToDatabase } from "../utils/database_updater.js"
import { refreshBotData } from "../utils/database_updater.js"
import { checkYgoprodeck, checkYugipedia } from "../utils/card_updater.js"



export const updateRouter = Router()

updateRouter.get('/:src', (req, res) => {
  const updateSources = { 'ygopd': checkYgoprodeck, 'yugipedia': checkYugipedia }
  const source = req.params.src
  const checkSource = updateSources[source]

  checkSource()
    .then(async (cards) => {
      if (cards.length) {
        let newCards = []
        if (source === 'ygopd') newCards = await fetchFromYugipedia(null, cards)
        else newCards = await fetchFromYugipedia(cards, null)

        await saveToDatabase(newCards)
        refreshBotData()
        
        console.log(`⭐ NEW CARD(S) [${cards.length}] SAVED!\n`)
        res.json({
          source,
          message: `${cards.length} new card(s) found!`,
          newCards: newCards.map(card => card.name),
          timestamp: new Date().toLocaleString('en-ph')
        })
      } else {
        console.log('👍 CARD DB IS UP TO DATE!\n')
        res.json({
          source,
          message: `[${source.toUpperCase()}] check finished, no new card(s) found`,
          timestamp: new Date().toLocaleString('en-ph')
        })
      }
    })
    .catch(err => res.json({ error: err.message } ))
})