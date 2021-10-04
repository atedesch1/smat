import { Router } from 'express'

import UserRouter from './client/UserRouter'
import PostRouter from './client/PostRouter'
import CommentRouter from './client/CommentRouter'
import MulterMiddleware from '@/middlewares/MulterMiddleware'
import CloudStorageService from '@/services/CloudStorageService'

const router = Router()

router.use('/user', UserRouter)
router.use('/post', PostRouter)
router.use('/comment', CommentRouter)

router.get('/', (req, res) => res.json('Api online.'))

router.post('/upload', MulterMiddleware.multer.single('file'), async(req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.')
    return
  }

  const fileURL = await CloudStorageService.uploadFile(req.file, 'test_folder', { resumable: false })

  res.status(200).send(fileURL)
})

export default router
