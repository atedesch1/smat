import { Router } from 'express'

import PostController from '@/controllers/PostController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/create', AuthMiddleware, PostController.createPost)
router.get('/:postId', PostController.getAPost)
router.put('/:postId', AuthMiddleware, PostController.updatePost)
router.put('/:postId/like', AuthMiddleware, PostController.likePost)
router.get('/:postId/like', AuthMiddleware, PostController.hasLikedPost)
router.delete('/:postId/like', AuthMiddleware, PostController.unlikePost)
router.delete('/:postId', AuthMiddleware, PostController.deletePost)
router.get('/:postId/comments', PostController.getPostComments)

export default router
