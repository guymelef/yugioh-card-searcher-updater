import { Schema, model } from 'mongoose'



const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseSensitive: true
  }
}, { strict: false })

export const OcgCard = model('OcgCard', cardSchema)
export const RushCard = model('RushCard', cardSchema)
export const StrayCard = model('StrayCard', cardSchema)
export const YgopdCard = model('YgopdCard', cardSchema)