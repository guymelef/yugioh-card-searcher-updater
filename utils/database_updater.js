import { OcgCard, RushCard, StrayCard } from '../models/card.js'
import { BOT_RD_URL, botRefreshDataRequestOption } from './config.js'



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
      if (error.code === 11000) {
        await new models[category].findOneAndReplace({ name: card.name }, card)
        return console.log("♻️  REPLACED MONGOOSE ENTRY FOR: [%s]", card.name)
      }

      console.log("🔴 MONGODB SAVE ERROR:", error.message)
      console.log("🔷", error.stack)
      throw new Error(error.message)
    }
  }
}

export const refreshBotData = () => fetch(`${BOT_RD_URL}`, botRefreshDataRequestOption)