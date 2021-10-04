import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import User from '@/models/User'
import Session from '@/models/Session'
import CloudStorageService from '@/services/CloudStorageService'
class UserController {
  async signUp(req: Request, res: Response) {
    const { email, password, name, nationality }:
      { email: User['email'], password: User['password'], name: User['name'], nationality: User['nationality'] } = req.body
      
    try {
      const userExists = await User.findByEmail(email)
  
      if (userExists) { return res.status(409).json('Email is already in use') }
  
      await User.createNew({ email, password, name, nationality })
  
      return res.status(201).json('Signed up successfully')
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t sign up user')
    }
  }

  async signIn(req: Request, res: Response) {
    const { email, password }:
      { email: User['email'], password: User['password'] } = req.body
      
    try {
      const user = await User.findOne({ where: { email }, relations: ['session'] })
      
      if (!user) { return res.status(404).json('Email not found') }
    
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (!isValidPassword) { return res.status(401).json('Invalid password') }

      if (user.session) { await Session.deleteSession(user.session.id) }
    
      const jwtSecret = process.env.JWT_SECRET || 'secret_key'
    
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' })
    
      await Session.createNew(user, token)
    
      return res.status(200).json({ user: { id: user.id, email: user.email }, token })
    } catch (err) {
      console.error(err.message)
      res.status(500).json('Server couldn\'t sign in user')
    }
  }

  async signOut(req: Request, res: Response) {
    const id = req.sessionId

    try {
      await Session.deleteSession(id)
  
      res.status(200).json('Signed out successfully')
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t sign out user')
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const id = req.userId
    const file = req.file
    const { name, nationality, bio }:
      { name?: User['name'], nationality?: User['nationality'], bio?: User['bio'] } = req.body

    try {
      const currentUser = await User.findOne({ where: { id } })
  
      if (!currentUser) { return res.status(404).json('User is not registered') }
      
      let pictureURL: string | undefined = undefined

      if (file) {
        const bucket = CloudStorageService.bucket

        if (currentUser.pictureURL) {
          const blob = bucket.file(currentUser.pictureURL.slice(42))
          await blob.delete()
        }

        const fileId: string = uuidv4()
        const blob = bucket.file(file.originalname + fileId)
        const blobStream = blob.createWriteStream({
          gzip: true, 
          metadata: { contentType: 'image/jpeg' }
        })
  
        blobStream.on('error', err => {
          next(err)
        })
        
        blobStream.end(file.buffer)

        pictureURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      }

      await User.updateUser(id, { name, nationality, bio, pictureURL })
  
      return res.status(201).json('User was updated successfully')
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t update user')
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.userId
    const sessionId = req.sessionId

    const { password }: { password: User['password'] } = req.body
    
    try {
      const currentUser = await User.findOne({ where: { id } })
  
      if (!currentUser) { return res.status(404).json('User is not registered') }
  
      const isValidPassword = await bcrypt.compare(password, currentUser.password)
  
      if (!isValidPassword) { return res.status(401).json('Invalid password') }
  
      await Session.deleteSession(sessionId)

      await User.deleteUser(id)
  
      return res.status(200).json('User was deleted successfully')
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t delete user')
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    const id = req.userId

    try {
      const user = await User.findOne({ where: { id } })
  
      if (!user) { return res.status(404).json('User is not registered') }
  
      return res.status(200).json(user)
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t get current user')
    }
  }

  async getAUser(req: Request, res: Response) {
    const { userId } = req.params

    try {
      const user = await User.findOne({ where: { id: userId } })
      
      if (!user) { return res.status(404).json('User not found') }
  
      return res.status(200).json(user)
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid user id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t get user')
    }
  }

  async getUserPosts(req: Request, res: Response) {
    const { userId } = req.params
    
    try {
      const user = await User.findOne({ where: { id: userId }, relations: ['posts'] })
  
      if (!user) { return res.status(404).json('User not found') }
  
      return res.status(200).json(user.posts)
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid user id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t get user posts')
    }
  }

  async searchUsers(req: Request, res: Response) {
    const { searchQuery } = req.body

    try {
      const matchedUsers = await User
        .createQueryBuilder()
        .select()
        .where('name ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
        .orWhere('bio ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
        .getMany()

      if (matchedUsers.length === 0) { return res.status(404).json('No users matched query') }

      return res.status(200).json(matchedUsers)
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process search query')
    }
  }
}

export default new UserController()
