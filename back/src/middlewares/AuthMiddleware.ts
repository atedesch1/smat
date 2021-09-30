import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayLoad {
    id: string
    iat: number
    exp: number
}

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) { return res.sendStatus(401) }

  const token = authorization.replace('Bearer', '').trim()

  const jwtSecret = process.env.JWT_SECRET || 'secret_key'

  try {
    const data = jwt.verify(token, jwtSecret)

    const { id } = data as TokenPayLoad

    req.userId = id

    next()
  } catch {
    return res.sendStatus(401)
  }
}
