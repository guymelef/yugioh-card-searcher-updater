import { config } from "dotenv"
config()



export const HOST = process.env.HOST
export const PORT = process.env.PORT
export const MONGODB_URI = process.env.MONGODB_URI
export const SECRET_KEY = process.env.SECRET_KEY
export const YGOPD_API = process.env.YGOPD_API
export const YUGIPEDIA_PAGE = process.env.YUGIPEDIA_PAGE
export const YUGIPEDIA_RC = process.env.YUGIPEDIA_RC
export const YUGIPEDIA_PAGEID = process.env.YUGIPEDIA_PAGEID
export const YUGIPEDIA_PAGETITLE = process.env.YUGIPEDIA_PAGETITLE
export const YUGIPEDIA_IMG = process.env.YUGIPEDIA_IMG
export const YUGIPEDIA_SEARCH = process.env.YUGIPEDIA_SEARCH
export const BOT_RD_URL = process.env.BOT_RD_URL
export const botRefreshDataRequestOption = { headers: { "X-Request-Key": `${SECRET_KEY}`} }
export const requestOptions = {
  headers: { "User-Agent": `${process.env.BOT_USER_AGENT}` },
  redirect: 'follow'
}