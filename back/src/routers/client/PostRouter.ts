import { Router } from 'express'

import PostController from '@/controllers/PostController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'
import MulterMiddleware from '@/middlewares/MulterMiddleware'

const router = Router()

router.get('/search/:searchQuery', PostController.searchPosts)
router.post('/create', AuthMiddleware, MulterMiddleware.multer.single('file'), PostController.createPost)
router.get('/:postId', PostController.getAPost)
router.put('/:postId', AuthMiddleware, MulterMiddleware.multer.single('file'), PostController.updatePost)
router.delete('/:postId', AuthMiddleware, PostController.deletePost)
router.get('/:postId/comments', PostController.getPostComments)
router.put('/:postId/like', AuthMiddleware, PostController.likePost)
router.get('/:postId/like', AuthMiddleware, PostController.hasLikedPost)
router.delete('/:postId/like', AuthMiddleware, PostController.unlikePost)

export default router
