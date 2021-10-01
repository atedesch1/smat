import { Router } from 'express'

import CommentController from '@/controllers/CommentController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/:postId', AuthMiddleware, CommentController.createComment)
router.get('/:commentId', CommentController.getAComment)
router.put('/:commentId', AuthMiddleware, CommentController.updateComment)
router.delete('/:commentId', AuthMiddleware, CommentController.deleteComment)

export default router
