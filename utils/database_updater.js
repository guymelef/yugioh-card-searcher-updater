import { OcgCard, RushCard, StrayCard } from '../models/card.js'
import { requestOptions, BOT_RD_URL } from './config.js'



export const saveToDatabase = async (cards) => {
  const models = { "stray": StrayCard, "ocg": OcgCard, "rush": RushCard }

  for (let card of cards) {
    try {
      const category = card.category
      const official = card.official
      if (official) delete card.official
      delete card.category

      console.log(`📁 SAVING "${card.name}"...`)
      const savedCard = await new models[category](card).save()

      console.log(`💾 《 "${savedCard.name}" 》/${category.toUpperCase()} (${official ? 'official' : 'unofficial'})/ saved to MongoDb!`)
      console.log(card)
    } catch (error) {
      console.log("🔴 MONGODB SAVE ERROR:", err.message)
      console.log("🔷", err.stack)
      throw new Error(err.message)
    }
  }
}

export const refreshBotData = () => fetch(`${BOT_RD_URL}`, requestOptions)