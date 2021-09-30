import { Router } from 'express'

import UserRouter from './client/UserRouter'

const router = Router()

router.use('/user', UserRouter)

router.get('/', (req, res) => res.json('Api online.'))

export default router
