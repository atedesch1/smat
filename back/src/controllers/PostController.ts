import { Request, Response } from 'express'

import Post from '@/models/Post'
import User from '@/models/User'
import { getConnection } from 'typeorm'

class PostController {
  async createPost(req: Request, res: Response) {
    const { file, language, description, subject, instructor } = req.body
    const id = req.userId

    try {
      const user = await User.findOne({ where: { id } })
  
      if (!user) { return res.sendStatus(401) }
  
      const newPost = await Post.createNew({ file, language, description, subject, instructor, user })
  
      return res.json(newPost)
    } catch (err) {
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async updatePost(req: Request, res: Response) {
    const { postId } = req.params
    const { file, language, description, subject, instructor }:
    { file?: Post['file'], language?: Post['language'], description?: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] } = req.body
    const userId = req.userId

    try {
      const postExists = await Post.findOne({ where: { id: postId }, loadRelationIds: true } )
  
      if (!postExists) { return res.sendStatus(404) }
  
      const isUsersPost = String(postExists.user) === userId
  
      if (!isUsersPost) { return res.sendStatus(403) }
  
      await Post.updatePost(postId, { file, language, description, subject, instructor })
  
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
