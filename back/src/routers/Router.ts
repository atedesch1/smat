import { Router } from 'express'

import UserRouter from './client/UserRouter'
import PostRouter from './client/PostRouter'
import CommentRouter from './client/CommentRouter'

const router = Router()

router.use('/user', UserRouter)
router.use('/post', PostRouter)
router.use('/comment', CommentRouter)

router.get('/', (req, res) => res.json('Api online.'))

export default router
