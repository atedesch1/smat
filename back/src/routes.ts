import { Router } from 'express'

import AuthMiddleware from './middlewares/AuthMiddleware'

import AuthController from './controllers/AuthController'
import UserController from './controllers/UserController'

const router = Router()

router.post('/api/users', UserController.store)
router.post('/api/auth', AuthController.authenticate)
router.get('/api/users', AuthMiddleware, UserController.index)

export default router
