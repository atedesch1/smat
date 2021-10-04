import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import Post from '@/models/Post'
import User from '@/models/User'
import { getConnection } from 'typeorm'
import CloudStorageService from '@/services/CloudStorageService'

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    const file = req.file
    const id = req.userId
    const { language, description, subject, instructor }:
      { language: Post['language'], description: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] } = req.body

    try {
      const user = await User.findOne({ where: { id } })
  
      if (!user) { return res.sendStatus(401) }

      if (!file) { return res.sendStatus(400) }

      const bucket = CloudStorageService.bucket

      const fileId: string = uuidv4()
      const blob = bucket.file(file.originalname + fileId)
      const blobStream = blob.createWriteStream()
  
      blobStream.on('error', err => {
        next(err)
      })
        
      blobStream.end(file.buffer)

      const fileURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      
      const newPost = await Post.createNew({ fileURL, language, description, subject, instructor, user })
  
      return res.json(newPost)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params
    const file = req.file
    const userId = req.userId
    const { language, description, subject, instructor }:
      { language?: Post['language'], description?: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] } = req.body

    try {
      const postExists = await Post.findOne({ where: { id: postId }, loadRelationIds: true } )
  
      if (!postExists) { return res.sendStatus(404) }
  
      const isUsersPost = String(postExists.user) === userId
  
      if (!isUsersPost) { return res.sendStatus(403) }

      let fileURL: string | undefined = undefined
      
      if (file) {
        const bucket = CloudStorageService.bucket

        const oldBlob = bucket.file(postExists.fileURL.slice(42))
        await oldBlob.delete()

        const fileId: string = uuidv4()
        const blob = bucket.file(file.originalname + fileId)
        const blobStream = blob.createWriteStream()
  
        blobStream.on('error', err => {
          next(err)
        })
        
        blobStream.end(file.buffer)

        fileURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      }

      await Post.updatePost(postId, { fileURL, language, description, subject, instructor })
  
      return res.sendStatus(201)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async deletePost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId
    
    try {
      const postExists = await Post.findOne({ where: { id: postId }, loadRelationIds: true } )
  
      if (!postExists) { return res.sendStatus(404) }
  
      const isUsersPost = String(postExists.user) === userId
  
      if (!isUsersPost) { return res.sendStatus(403) }
  
      const bucket = CloudStorageService.bucket

      const oldBlob = bucket.file(postExists.fileURL.slice(42))
      await oldBlob.delete()

      await Post.deletePost(postId)
  
      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async getAPost(req: Request, res: Response) {
    const { postId } = req.params

    try {
      const post = await Post.findOne({ where: { id: postId }, relations: ['comments'] })

      if (!post) { return res.sendStatus(404) }

      return res.json(post)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async getPostComments(req: Request, res: Response) {
    const { postId } = req.params

    try {
      const post = await Post.findOne({ where: { id: postId }, relations: ['comments'] })
  
      if (!post) { return res.sendStatus(404) }
  
      return res.json(post.comments)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async likePost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId

    try {
      const post = await Post.findOne({ where: { id: postId } })
  
      if (!post) { return res.sendStatus(404) }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('posts_users_liked_users', 'posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (liked.length !== 0) { return res.sendStatus(409) }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into('posts_users_liked_users')
        .values([
          { postsId: postId, usersId: userId }
        ])
        .execute()

      await Post.update({ id: postId }, { like_count: post.like_count + 1 })

      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      if (err.code === '23505') { return res.sendStatus(409) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async hasLikedPost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId

    try {
      const post = await Post.findOne({ where: { id: postId } })
  
      if (!post) { return res.sendStatus(404) }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('posts_users_liked_users', 'posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.json('false') }
      
      return res.json('true')
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async unlikePost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId

    try {
      const post = await Post.findOne({ where: { id: postId }, relations: ['usersLiked'] })
  
      if (!post) { return res.sendStatus(404) }

      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('posts_users_liked_users', 'posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.sendStatus(400) }

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from('posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (post.like_count > 0) {
        await Post.update({ id: postId }, { like_count: post.like_count - 1 })
      }

      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }
}

export default new PostController()
