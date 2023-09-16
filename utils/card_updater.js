import { requestOptions, YGOPD_API, YUGIPEDIA_RC } from './config.js'
import { OcgCard, RushCard, StrayCard } from '../models/card.js'
import BotVariable from '../models/variable.js'

let MAIN_CARDS
let RUSH_CARDS
let STRAY_CARDS
let YGOPDCOUNT
let YUGIPEDIA_LAST_UPDATE



export const fetchAllData = async () => {
  try {
    MAIN_CARDS = await OcgCard.find({}, 'name -_id').lean().exec()
    RUSH_CARDS = await RushCard.find({}, 'name -_id').lean().exec()
    STRAY_CARDS = await StrayCard.find({}, 'name -_id').lean().exec()
    console.log("🗃️  OCG/TCG CARDS:", MAIN_CARDS.length.toLocaleString('en-ph'))
    console.log("🗃️  RUSH CARDS:", RUSH_CARDS.length.toLocaleString('en-ph'))
    console.log("🗃️  STRAY CARDS:", STRAY_CARDS.length.toLocaleString('en-ph'))

    const ygoprodeck = await BotVariable.findOne({ name: 'YGOPRODeck' })
    YGOPDCOUNT = ygoprodeck.card_count
    console.log(`🟩 YGOPRODECK CARD COUNT (${ygoprodeck.last_update}): 💠 ${YGOPDCOUNT.toLocaleString('en-ph')}`)

    const yugipedia = await BotVariable.findOne({ name: 'Yugipedia' })
    YUGIPEDIA_LAST_UPDATE = yugipedia.lastUpdate
    console.log(`🟩 YUGIPEDIA LAST UPDATE: 💠 ${new Date(YUGIPEDIA_LAST_UPDATE).toLocaleString('en-ph')}`)
  } catch (err) {
    console.log("🔴 CARDS FETCH ERROR:", err.message)
    console.log("🔷", err.stack)
  }
}

export const checkYgoprodeck = async () => {
  await fetchAllData()
  let newCards = []

  let ygopdCards = await fetch(YGOPD_API)
  ygopdCards = await ygopdCards.json()
  ygopdCards = ygopdCards.data
    
  console.log("==========================")
  console.log("MAIN CARDS COUNT: 🔸", MAIN_CARDS.length.toLocaleString('en-ph'))
  console.log("YGOPRODECK COUNT: 🔸", ygopdCards.length.toLocaleString('en-ph'))
  console.log("==========================")

  if (YGOPDCOUNT === ygopdCards.length) return newCards
  else YGOPDCOUNT = ygopdCards.length

  await BotVariable.findOneAndUpdate(
    { name: 'YGOPRODeck' },
    { card_count: YGOPDCOUNT, last_update: new Date().toLocaleString('en-ph') }
  )
  
  console.log("❓ DATABASE MAY NEED UPDATE...")
  const cardstoIgnore = require('../data/cards-to-ignore.json')
  MAIN_CARDS.forEach(card => cardstoIgnore.push(card.name))
  
  ygopdCards.forEach(card => {
    if (!cardstoIgnore.includes(card.name)) {
      newCards.push(card.name)
    }
  })

  return newCards
}

export const checkYugipedia = async () => {
  await fetchAllData()
  let newCards = []

  const recentChanges = await fetch(`${YUGIPEDIA_RC}${YUGIPEDIA_LAST_UPDATE}`, requestOptions)
  let rc = await recentChanges.json()
  rc = rc.query.recentchanges

  console.log('******************************************************')
  console.log('LAST YUGIPEDIA CARD CREATED: 🕒', new Date(YUGIPEDIA_LAST_UPDATE).toLocaleString('en-ph'))
  console.log('MOST RECENT CHANGE (NEW): 🕒', new Date(rc[0].timestamp).toLocaleString('en-ph'))
  console.log('******************************************************')

  let newCardPages = rc.filter(item => {
    const comment = item.comment.toLowerCase()
    if (comment.includes('{{cardtable2') && item.timestamp !== YUGIPEDIA_LAST_UPDATE) return item
  })

  if (newCardPages.length) {
    console.log(`📢 [${newCardPages.length}] NEW YUGIPEDIA CARD(S) FOUND!`)
    
    YUGIPEDIA_LAST_UPDATE = newCardPages[0].timestamp

    await BotVariable.findOneAndUpdate(
      { name: "Yugipedia" },
      { lastUpdate: YUGIPEDIA_LAST_UPDATE,
        lastCard: { 
          title: newCardPages[0].title, 
          pageid: newCardPages[0].pageid 
        }
      }
    )
    
    newCards = newCardPages.map(page => page.pageid)
  }
  
  return newCards
}