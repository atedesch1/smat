import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '@/models/User'
class UserController {
  async signUp(req: Request, res: Response) {
    const { email, password, name, nationality }:
      { email: User['email'], password: User['password'], name: User['name'], nationality: User['nationality'] } = req.body

    const userExists = await User.findByEmail(email)

    if (userExists) { return res.sendStatus(409) }

    const newUser = await User.createNew(email, password, name, nationality)

    return res.json(newUser)
  }

  async signIn(req: Request, res: Response) {
    const { email, password }:
      { email: User['email'], password: User['password'] } = req.body

    const user = await User.findByEmail(email)

    if (!user) { return res.sendStatus(401) }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) { return res.sendStatus(401) }

    const jwtSecret = process.env.JWT_SECRET || 'secret_key'

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' })

    return res.json({ user: { id: user.id, email: user.email }, token })
  }

  async updateUser(req: Request, res: Response) {
    const id = req.userId
    const { name, nationality, profilePicture, bio }:
      { name?: User['name'], nationality?: User['nationality'], profilePicture?: User['profilePicture'], bio?: User['bio'] } = req.body

    const currentUser = await User.findOne({ where: { id } })

    if (!currentUser) { return res.sendStatus(401) }

    await User.updateUser(id, { name, nationality, profilePicture, bio })

    return res.sendStatus(201)
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.userId
    const { password }: { password: User['password'] } = req.body

    const currentUser = await User.findOne({ where: { id } })

    if (!currentUser) { return res.sendStatus(401) }

    const isValidPassword = await bcrypt.compare(password, currentUser.password)

    if (!isValidPassword) { return res.sendStatus(401) }

    await User.deleteUser(id)

    return res.sendStatus(200)
  }

  async getCurrentUser(req: Request, res: Response) {
    const id = req.userId

    const user = await User.findOne({ where: { id } })

    if (!user) { return res.sendStatus(404) }

    return res.json(user)
  }

  async getAUser(req: Request, res: Response) {
    const { id } = req.params

    const user = await User.findOne({ where: { id } })

    if (!user) { return res.sendStatus(404) }

    return res.json(user)
  }

  async getUserPosts(req: Request, res: Response) {
    const { id } = req.params

    const user = await User.findOne({ where: { id }, relations: ['posts'] })

    if (!user) { return res.sendStatus(404) }

    return res.json(user.posts)
  }
}

export default new UserController()
