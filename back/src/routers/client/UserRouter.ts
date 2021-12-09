import { Router } from 'express'

import UserController from '@/controllers/UserController'
import AuthMiddleware from '@/middlewares/AuthMiddleware'
import MulterMiddleware from '@/middlewares/MulterMiddleware'

const router = Router()

router.get('/search?:searchQuery', UserController.searchUsers)
router.post('/sign-up', UserController.signUp)
router.post('/sign-in', UserController.signIn)
router.post('/sign-out', AuthMiddleware, UserController.signOut)
router.put('', AuthMiddleware, MulterMiddleware.multer.single('file'), UserController.updateUser)
router.delete('', AuthMiddleware, UserController.deleteUser)
router.get('/session', AuthMiddleware, UserController.getCurrentUser)
router.get('/:userId', UserController.getAUser)
router.get('/:userId/posts', UserController.getUserPosts)

export default router
