import { Request, Response } from 'express'

import Post from '@/models/Post'
import User from '@/models/User'

class PostController {
  async publish(req: Request, res: Response) {
    const { file, language, description, subject, instructor } = req.body
    const userId = req.userId

    const user = await User.findOne({ where: { id: userId } })

    if (!user) {return res.sendStatus(401)}

    const newPost = await Post.createNew({ file, language, description, subject, instructor, user })

    return res.json(newPost)
  }

  async deletePost(req: Request, res: Response) {
    const { postId } = req.body
    const userId = req.userId

    const postExists = await Post.findOne({ where: { id: postId }, loadRelationIds: true } )

    if (!postExists) { return res.sendStatus(404)}

    const isUsersPost = String(postExists.user) === userId

    if (!isUsersPost) {return res.sendStatus(403)}

    await Post.deletePost(postId)

    return res.json('Post was deleted.')
  }

  async getAPost(req: Request, res: Response) {
    const { id } = req.params

    const post = await Post.findOne({ where: { id } } )

    if (!post) {return res.sendStatus(404)}

    return res.json(post)
  }
}

export default new PostController()
