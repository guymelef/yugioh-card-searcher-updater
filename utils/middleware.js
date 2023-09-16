import { SECRET_KEY } from "./config.js"


export const checkRequestKeyHeader = (req, res, next) => {
  const requestKey = req.header('X-Request-Key')

  if (requestKey === SECRET_KEY) next()
  else res.status(403).end()
}