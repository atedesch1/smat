import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User'
class UserController {
  userSession(req: Request, res: Response) {
    return res.send({ userID: req.userId })
  }

  async signUp(req: Request, res: Response) {
    const repository = getRepository(User)
    const { email, password } = req.body

    const userExists = await repository.findOne({ where: { email } })

    if (userExists) { return res.sendStatus(409) }

    const newUser = repository.create({ email, password })
    await repository.save(newUser)

    return res.json(newUser)
  }

  async signIn(req: Request, res: Response) {
    const repository = getRepository(User)
    const { email, password } = req.body

    const user = await repository.findOne({ where: { email } })

    if (!user) { return res.sendStatus(401) }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) { return res.sendStatus(401) }

    const jwtSecret = process.env.JWT_SECRET || 'secret_key'

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' })

    return res.json({ user: { id: user.id, email: user.email }, token })
  }

  async deleteCurrentUser(req: Request, res: Response) {
    const repository = getRepository(User)
    const userId = req.userId
    const { password } = req.body

    const currentUser = await repository.findOne({ where: { id: userId } })

    if (!currentUser) { return res.sendStatus(401) }

    const isValidPassword = await bcrypt.compare(password, currentUser.password)

    if (!isValidPassword) { return res.sendStatus(401) }

    await repository.delete({ id: userId })

    return res.json(`User with email:${currentUser.email} was deleted!`)
  }
}

export default new UserController()
