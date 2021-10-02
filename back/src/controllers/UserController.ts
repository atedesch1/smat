import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '@/models/User'
import Session from '@/models/Session'
class UserController {
  async signUp(req: Request, res: Response) {
    const { email, password, name, nationality }:
      { email: User['email'], password: User['password'], name: User['name'], nationality: User['nationality'] } = req.body
      
    try {
      const userExists = await User.findByEmail(email)
  
      if (userExists) { return res.sendStatus(409) }
  
      const newUser = await User.createNew(email, password, name, nationality)
  
      return res.json(newUser)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async signIn(req: Request, res: Response) {
    const { email, password }:
      { email: User['email'], password: User['password'] } = req.body
      
    try {
      const user = await User.findOne({ where: { email }, relations: ['session'] })
    
      if (!user) { return res.sendStatus(401) }
    
      const isValidPassword = await bcrypt.compare(password, user.password)
    
      if (!isValidPassword) { return res.sendStatus(401) }
    
      if (user.session) { Session.deleteSession(user.session.id) }
    
      const jwtSecret = process.env.JWT_SECRET || 'secret_key'
    
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' })
    
      await Session.createNew(user, token)
    
      return res.json({ user: { id: user.id, email: user.email }, token })
    } catch (err) {
      console.error(err.message)
      res.sendStatus(500)
    }
  }

  async signOut(req: Request, res: Response) {
    const id = req.sessionId

    try {
      await Session.deleteSession(id)
  
      res.sendStatus(200)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async updateUser(req: Request, res: Response) {
    const id = req.userId
    const { name, nationality, profilePicture, bio }:
      { name?: User['name'], nationality?: User['nationality'], profilePicture?: User['profilePicture'], bio?: User['bio'] } = req.body

    try {
      const currentUser = await User.findOne({ where: { id } })
  
      if (!currentUser) { return res.sendStatus(401) }
  
      await User.updateUser(id, { name, nationality, profilePicture, bio })
  
      return res.sendStatus(201)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.userId
    const { password }: { password: User['password'] } = req.body
    
    try {
      const currentUser = await User.findOne({ where: { id } })
  
      if (!currentUser) { return res.sendStatus(401) }
  
      const isValidPassword = await bcrypt.compare(password, currentUser.password)
  
      if (!isValidPassword) { return res.sendStatus(401) }
  
      await User.deleteUser(id)
  
      return res.sendStatus(200)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    const id = req.userId

    try {
      const user = await User.findOne({ where: { id } })
  
      if (!user) { return res.sendStatus(404) }
  
      return res.json(user)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async getAUser(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await User.findOne({ where: { id } })
      
      if (!user) { return res.sendStatus(404) }
  
      return res.json(user)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async getUserPosts(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await User.findOne({ where: { id }, relations: ['posts'] })
  
      if (!user) { return res.sendStatus(404) }
  
      return res.json(user.posts)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }
}

export default new UserController()
