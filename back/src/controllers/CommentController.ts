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
  
      if (!user) { return res.status(401).json('User is not registered') }
  
      const post = await Post.findOne({ where: { id: postId } })
  
      if (!post) { return res.status(404).json('Post not found') }
  
      const newComment = await Comment.createNew({ body, post, user })
  
      return res.status(200).json(newComment)
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t create comment')
    }
  }

  async updateComment(req: Request, res: Response) {
    const userId = req.userId
    const { commentId } = req.params
    const { body } = req.body
    
    try {
      const user = await User.findOne({ where: { id: userId } })
  
      if (!user) { return res.status(401).json('User is not registered') }
  
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.status(404).json('Comment not found') }
  
      await Comment.updateComment(commentId, { body })
  
      return res.status(200).json('Comment was updated successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid comment id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t update comment')
    }
  }

  async deleteComment(req: Request, res: Response) {
    const userId = req.userId
    const { commentId } = req.params
    
    try {
      const user = await User.findOne({ where: { id: userId } })
  
      if (!user) { return res.status(401).json('User is not registered') }
  
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.status(404).json('Comment not found') }
  
      await Comment.deleteComment(commentId)
  
      return res.status(200).json('Comment was deleted successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid comment id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t delete comment')
    }
  }

  async getAComment(req: Request, res: Response) {
    const { commentId } = req.params

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.status(404).json('Comment not found') }
  
      return res.json(comment)
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid comment id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t get comment')
    }
  }

  async likeComment(req: Request, res: Response) {
    const { commentId } = req.params
    const userId = req.userId

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.status(404).json('Comment not found')  }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('comments_users_liked_users', 'comments_users_liked_users')
        .where({ commentsId: commentId, usersId: userId })
        .execute()

      if (liked.length !== 0) { return res.status(409).json('User already liked comment') }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into('comments_users_liked_users')
        .values([
          { commentsId: commentId, usersId: userId }
        ])
        .execute()

      await Comment.update({ id: commentId }, { like_count: comment.like_count + 1 })

      return res.status(200).json('Comment was liked successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid comment id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process like comment request')
    }
  }

  async hasLikedComment(req: Request, res: Response) {
    const { commentId } = req.params
    const userId = req.userId

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.status(404).json('Comment not found') }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('comments_users_liked_users', 'comments_users_liked_users')
        .where({ commentsId: commentId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.status(200).json('false') }

      return res.status(200).json('true')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid comment id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process has liked comment request')
    }
  }

  async unlikeComment(req: Request, res: Response) {
    const { commentId } = req.params
    const userId = req.userId

    try {
      const comment = await Comment.findOne({ where: { id: commentId } })
  
      if (!comment) { return res.status(404).json('Comment not found') }

      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('comments_users_liked_users', 'comments_users_liked_users')
        .where({ commentsId: commentId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.status(400).json('User has not liked comment') }

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
      if (err.code === '22P02') { return res.status(404).json('Invalid comment id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process unlike comment request')
    }
  }
}

export default new CommentController()
