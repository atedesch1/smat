import { Router } from 'express'

import PostController from '@/controllers/PostController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/create', AuthMiddleware, PostController.createPost)
router.get('/:id', PostController.getAPost)
router.put('/:id', AuthMiddleware, PostController.updatePost)
router.delete('/:id', AuthMiddleware, PostController.deletePost)
router.get('/:id/comments', PostController.getPostComments)

export default router
