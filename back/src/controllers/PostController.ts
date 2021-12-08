import { Request, Response } from 'express'

import Post from '@/models/Post'
import User from '@/models/User'
import { getConnection, Like } from 'typeorm'
import CloudStorageService from '@/services/CloudStorageService'

class PostController {
  async createPost(req: Request, res: Response) {
    const file = req.file
    const id = req.userId
    const { language, title, description, subject, instructor }:
      { language: Post['language'], title: Post['title'], description: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] } = req.body

    try {
      const user = await User.findOne({ where: { id } })
  
      if (!user) { return res.status(401).json('User is not registered') }

      if (!title || !description) { return res.status(400).json('Missing required parameters') }

      if (!file) { return res.status(400).json('Missing file attached') }

      const fileURL = await CloudStorageService.uploadFile(file, 'post_files', {
        resumable: false,
        gzip: true
      })
      
      const newPost = await Post.createNew({ fileURL, language, title, description, subject, instructor, user })
  
      return res.status(200).json(newPost)
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t create post')
    }
  }

  async updatePost(req: Request, res: Response) {
    const { postId } = req.params
    const file = req.file
    const userId = req.userId
    const { language, title, description, subject, instructor }:
      { language?: Post['language'], title?: Post['title'], description?: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] } = req.body

    try {
      const post = await Post.findOne({ where: { id: postId }, loadRelationIds: true } )
  
      if (!post) { return res.status(404).json('Post not found') }
  
      const isUsersPost = String(post.user) === userId
  
      if (!isUsersPost) { return res.status(403).json('Post is not user\'s') }

      let fileURL: string | undefined = undefined
      
      if (file) {
        if (post.fileURL) { await CloudStorageService.deleteFile(post.fileURL) }

        fileURL = await CloudStorageService.uploadFile(file, 'post_files', {
          resumable: false,
          gzip: true
        })
      }

      await Post.updatePost(postId, { fileURL, language, title, description, subject, instructor })
  
      return res.status(201).json('Post was updated successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t update post')
    }
  }

  async deletePost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId
    
    try {
      const post = await Post.findOne({ where: { id: postId }, loadRelationIds: true } )
  
      if (!post) { return res.status(404).json('Post not found') }
  
      const isUsersPost = String(post.user) === userId
  
      if (!isUsersPost) { return res.status(403).json('Post is not user\'s') }
  
      if (post.fileURL) { await CloudStorageService.deleteFile(post.fileURL) }

      await Post.deletePost(postId)
  
      return res.status(200).json('Post was deleted successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t delete post')
    }
  }

  async getAPost(req: Request, res: Response) {
    const { postId } = req.params

    try {
      const post = await Post.findOne({ where: { id: postId }, relations: ['comments'] })

      if (!post) { return res.status(404).json('Post not found') }

      return res.status(200).json(post)
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t get post')
    }
  }

  async getPostComments(req: Request, res: Response) {
    const { postId } = req.params

    try {
      const post = await Post.findOne({ where: { id: postId }, relations: ['comments'] })
  
      if (!post) { return res.status(404).json('Post not found') }
  
      return res.status(200).json(post.comments)
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t get post comments')
    }
  }

  async likePost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId

    try {
      const post = await Post.findOne({ where: { id: postId } })
  
      if (!post) { return res.status(404).json('Post not found') }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('posts_users_liked_users', 'posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (liked.length !== 0) { return res.status(409).json('User already liked post') }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into('posts_users_liked_users')
        .values([
          { postsId: postId, usersId: userId }
        ])
        .execute()

      await Post.update({ id: postId }, { like_count: post.like_count + 1 })

      return res.status(200).json('Post was liked successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process like post request')
    }
  }

  async hasLikedPost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId

    try {
      const post = await Post.findOne({ where: { id: postId } })
  
      if (!post) { return res.status(404).json('Post not found') }
      
      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('posts_users_liked_users', 'posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.status(200).json('false') }
      
      return res.status(200).json('true')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process has liked post request')
    }
  }

  async unlikePost(req: Request, res: Response) {
    const { postId } = req.params
    const userId = req.userId

    try {
      const post = await Post.findOne({ where: { id: postId }, relations: ['usersLiked'] })
  
      if (!post) { return res.status(404).json('Post not found') }

      const liked = await getConnection()
        .createQueryBuilder()
        .select()
        .from('posts_users_liked_users', 'posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (liked.length === 0) { return res.status(400).json('User has not liked post') }

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from('posts_users_liked_users')
        .where({ postsId: postId, usersId: userId })
        .execute()

      if (post.like_count > 0) {
        await Post.update({ id: postId }, { like_count: post.like_count - 1 })
      }

      return res.status(200).json('Post unliked successfully')
    } catch (err) {
      if (err.code === '22P02') { return res.status(404).json('Invalid post id') }
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process unlike post request')
    }
  }

  async searchPosts(req: Request, res: Response) {
    const { searchQuery } = req.params
    
    try {
      // const matchedPosts = await Post
      //   .createQueryBuilder()
      //   .select()
      //   .where('title ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      //   .orWhere('description ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      //   .orWhere('subject ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      //   .orWhere('instructor ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      //   .getMany()

      const matchedPosts = await Post.find({ 
        where: [
          { title: Like(`%${searchQuery}%`) },
          { description: Like(`%${searchQuery}%`) },
          { subject: Like(`%${searchQuery}%`) },
          { instructor: Like(`%${searchQuery}%`) }
        ]
      })

      // if (matchedPosts.length === 0) { return res.status(404).json('No posts matched query') }

      return res.status(200).json(matchedPosts)
    } catch (err) {
      console.error(err.message)
      return res.status(500).json('Server couldn\'t process search posts request')
    }
  }
}

export default new PostController()
