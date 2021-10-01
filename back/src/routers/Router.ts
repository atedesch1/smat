import { Router } from 'express'

import UserRouter from './client/UserRouter'
import PostRouter from './client/PostRouter'

const router = Router()

router.use('/user', UserRouter)
router.use('/post', PostRouter)

router.get('/', (req, res) => res.json('Api online.'))

export default router
