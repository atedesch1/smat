import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import Session from '@/models/Session'
interface TokenPayLoad {
    id: string
    iat: number
    exp: number
}

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) { return res.status(401).send('No token received') }

  const token = authorization.replace('Bearer', '').trim()

  const jwtSecret = process.env.JWT_SECRET || 'secret_key'

  try {
    const data = jwt.verify(token, jwtSecret)

    const { id } = data as TokenPayLoad

    const session = await Session.findOne({ where: { token } })

    if (!session) {
      return res.status(401).json('User is not logged in')
    }

    req.userId = id
    req.sessionId = session.id

    next()
  } catch (err) {
    if (err.message === 'jwt expired') {
      const session = await Session.findOne({ where: { token } })

      if (session) { Session.deleteSession(session.id) }

      return res.status(401).json('Token expired')
    }
    return res.status(401).json('Invalid token')
  }
}
