import { Request, Response } from 'express'

import Post from '@/models/Post'
import User from '@/models/User'

class PostController {
  async createPost(req: Request, res: Response) {
    const { file, language, description, subject, instructor } = req.body
    const id = req.userId

    const user = await User.findOne({ where: { id } })

    if (!user) { return res.sendStatus(401) }

    const newPost = await Post.createNew({ file, language, description, subject, instructor, user })

    return res.json(newPost)
  }

  async updatePost(req: Request, res: Response) {
    const { id } = req.params
    const { file, language, description, subject, instructor }:
    { file?: Post['file'], language?: Post['language'], description?: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] } = req.body
    const userId = req.userId

    const postExists = await Post.findOne({ where: { id }, loadRelationIds: true } )

    if (!postExists) { return res.sendStatus(404) }

    const isUsersPost = String(postExists.user) === userId

    if (!isUsersPost) { return res.sendStatus(403) }

    await Post.updatePost(id, { file, language, description, subject, instructor })

    return res.sendStatus(201)
  }

  async deletePost(req: Request, res: Response) {
    const { id } = req.params
    const userId = req.userId

    const postExists = await Post.findOne({ where: { id }, loadRelationIds: true } )

    if (!postExists) { return res.sendStatus(404) }

    const isUsersPost = String(postExists.user) === userId

    if (!isUsersPost) { return res.sendStatus(403) }

    await Post.deletePost(id)

    return res.sendStatus(200)
  }

  async getAPost(req: Request, res: Response) {
    const { id } = req.params

    const post = await Post.findOne({ where: { id }, relations: ['comments'] })

    if (!post) { return res.sendStatus(404) }

    return res.json(post)
  }

  async getPostComments(req: Request, res: Response) {
    const { id } = req.params

    const post = await Post.findOne({ where: { id }, relations: ['comments'] })

    if (!post) { return res.sendStatus(404) }

    return res.json(post.comments)
  }
}

export default new PostController()
