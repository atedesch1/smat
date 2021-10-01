import { Router } from 'express'

import UserController from '@/controllers/UserController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/sign-up', UserController.signUp)
router.post('/sign-in', UserController.signIn)
router.post('/sign-out', AuthMiddleware, UserController.signOut)
router.put('/update', AuthMiddleware, UserController.updateUser)
router.delete('/delete', AuthMiddleware, UserController.deleteUser)
router.get('/session', AuthMiddleware, UserController.getCurrentUser)
router.get('/:id', UserController.getAUser)
router.get('/:id/posts', UserController.getUserPosts)

export default router
