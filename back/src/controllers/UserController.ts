import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '@/models/User'
class UserController {
  getSession(req: Request, res: Response) {
    return res.send({ userId: req.userId })
  }

  async signUp(req: Request, res: Response) {
    const { email, password, name, nationality } = req.body

    const userExists = await User.findByEmail(email)

    if (userExists) { return res.sendStatus(409) }

    const newUser = await User.createNew(email, password, name, nationality)

    return res.json(newUser)
  }

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body

    const user = await User.findByEmail(email)

    if (!user) { return res.sendStatus(401) }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) { return res.sendStatus(401) }

    const jwtSecret = process.env.JWT_SECRET || 'secret_key'

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' })

    return res.json({ user: { id: user.id, email: user.email }, token })
  }

  async deleteUser(req: Request, res: Response) {
    const userId = req.userId
    const { password } = req.body

    const currentUser = await User.findOne({ where: { id: userId } })

    if (!currentUser) { return res.sendStatus(401) }

    const isValidPassword = await bcrypt.compare(password, currentUser.password)

    if (!isValidPassword) { return res.sendStatus(401) }

    await User.deleteUser(userId)

    return res.json(`User with email:${currentUser.email} was deleted!`)
  }

  async getAUser(req: Request, res: Response) {
    const { id } = req.params

    const user = await User.findOne({ where: { id } })

    if (!user) {return res.sendStatus(404)}

    return res.json(user)
  }

  async getUserPosts(req: Request, res: Response) {
    const { id } = req.params

    const posts = await User.getUserPosts(id)

    res.json(posts)
  }
}

export default new UserController()
