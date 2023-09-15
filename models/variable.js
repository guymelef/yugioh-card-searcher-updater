import { Schema, model } from 'mongoose'



const variableSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseSensitive: true
  }
}, { strict: false })

export default model('BotVariable', variableSchema)