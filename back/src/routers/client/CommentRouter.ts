import { Router } from 'express'

import CommentController from '@/controllers/CommentController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/:postId', AuthMiddleware, CommentController.createComment)
router.get('/:commentId', CommentController.getAComment)
router.put('/:commentId', AuthMiddleware, CommentController.updateComment)
router.delete('/:commentId', AuthMiddleware, CommentController.deleteComment)
router.get('/:commentId/like', AuthMiddleware, CommentController.hasLikedComment)
router.put('/:commentId/like', AuthMiddleware, CommentController.likeComment)
router.delete('/:commentId/like', AuthMiddleware, CommentController.unlikeComment)

export default router
