import { Router } from 'express'

import UserController from '@/controllers/UserController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'

const router = Router()

router.post('/sign-up', UserController.signUp)
router.post('/sign-in', UserController.signIn)
router.get('/session', AuthMiddleware, UserController.userSession)
router.delete('/delete', AuthMiddleware, UserController.deleteCurrentUser)

export default router
