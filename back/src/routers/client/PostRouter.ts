import { Router } from 'express'

import PostController from '@/controllers/PostController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/publish', AuthMiddleware, PostController.publish)
router.delete('/delete', AuthMiddleware, PostController.deletePost)
router.get('/:id', PostController.getAPost)

export default router
