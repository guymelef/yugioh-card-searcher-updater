import { Router } from "express"



export const indexRouter = Router()

indexRouter.get('/', (_, res) => {
  const twitchChannel = `
    <h1>
      <a href="https://twitch.tv/cardsearcher">CardSearcher</a>
    </h1>
  `
  res.setHeader('Content-Type', 'text/html')
  res.send(twitchChannel)
})