import { Request, Response } from 'express'

import Comment from '@/models/Comment'
import User from '@/models/User'
import Post from '@/models/Post'

class CommentController {
  async createComment(req: Request, res: Response) {
    const userId = req.userId
    const { postId } = req.params
    const { body } = req.body

    const user = await User.findOne({ where: { id: userId } })

    if (!user) { return res.sendStatus(401) }

    const post = await Post.findOne({ where: { id: postId } })

    if (!post) { return res.sendStatus(404) }

    const newComment = await Comment.createNew({ body, post, user })

    return res.json(newComment)
  }

  async updateComment(req: Request, res: Response) {
    const userId = req.userId
    const { commentId } = req.params
    const { body } = req.body

    const user = await User.findOne({ where: { id: userId } })

    if (!user) { return res.sendStatus(401) }

    const comment = await Comment.findOne({ where: { id: commentId } })

    if (!comment) { return res.sendStatus(404) }

    await Comment.updateComment(commentId, { body })

    return res.sendStatus(200)
  }

  async deleteComment(req: Request, res: Response) {
    const userId = req.userId
    const { commentId } = req.params

    const user = await User.findOne({ where: { id: userId } })

    if (!user) { return res.sendStatus(401) }

    const comment = await Comment.findOne({ where: { id: commentId } })

    if (!comment) { return res.sendStatus(404) }

    await Comment.deleteComment(commentId)

    return res.sendStatus(200)
  }

  async getAComment(req: Request, res: Response) {
    const { commentId } = req.params

    const comment = await Comment.findOne({ where: { id: commentId } })

    if (!comment) { return res.sendStatus(404) }

    return res.json(comment)
  }
}

export default new CommentController()
