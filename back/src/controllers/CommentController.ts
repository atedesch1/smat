import { Request, Response } from 'express'

import Comment from '@/models/Comment'
import User from '@/models/User'
import Post from '@/models/Post'
import { getConnection } from 'typeorm'

class CommentController {
  async createComment(req: Request, res: Response) {
    const userId = req.userId
    const { postId } = req.params
    const { body } = req.body
    
    try {
      const user = await User.findOne({ where: { id: userId } })
  
      if (!user) { return res.sendStatus(401) }
  
      const post = await Post.findOne({ where: { id: postId } })
  
      if (!post) { return res.sendStatus(404) }
  
      const newComment = await Comment.createNew({ body, post, user })
  
      return res.json(newComment)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async updateComment(req: Request, res: Response) {
    const userId = req.userId
    const { commentId } = req.params
    const { body } = req.body
    
    try {
      const user = await User.findOne({ where: { id: userId } })
  
      if (!user) { return res.sendStatus(401) }
  
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.sendStatus(404) }
  
      await Comment.updateComment(commentId, { body })
  
      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async deleteComment(req: Request, res: Response) {
    const userId = req.userId
    const { commentId } = req.params
    
    try {
      const user = await User.findOne({ where: { id: userId } })
  
      if (!user) { return res.sendStatus(401) }
  
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.sendStatus(404) }
  
      await Comment.deleteComment(commentId)
  
      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async getAComment(req: Request, res: Response) {
    const { commentId } = req.params

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.sendStatus(404) }
  
      return res.json(comment)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async likeComment(req: Request, res: Response) {
    const { commentId } = req.params
    const userId = req.userId

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.sendStatus(404) }
      
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into('comments_users_liked_users')
        .values([
          { commentsId: commentId, usersId: userId }
        ])
        .execute()

      await Comment.update({ id: commentId }, { like_count: comment.like_count + 1 })

      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      if (err.code === '23505') { return res.sendStatus(409) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async hasLikedComment(req: Request, res: Response) {
    const { commentId } = req.params
    const userId = req.userId

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.sendStatus(404) }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('comments_users_liked_users', 'comments_users_liked_users')
        .where({ commentsId: commentId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.json('false') }

      return res.json('true')
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }

  async unlikeComment(req: Request, res: Response) {
    const { commentId } = req.params
    const userId = req.userId

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.sendStatus(404) }

      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('comments_users_liked_users', 'comments_users_liked_users')
        .where({ commentsId: commentId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.sendStatus(400) }

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from('comments_users_liked_users')
        .where({ commentsId: commentId, usersId: userId })
        .execute()

      if (comment.like_count > 0) {
        await Comment.update({ id: commentId }, { like_count: comment.like_count - 1 })
      }

      return res.sendStatus(200)
    } catch (err) {
      if (err.code === '22P02') { return res.sendStatus(404) }
      console.error(err.message)
      return res.sendStatus(500)
    }
  }
}

export default new CommentController()
