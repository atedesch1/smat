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

router.post('/upload', MulterMiddleware.multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.')
    return
  }
  
  // Create a new blob in the bucket and upload the file data.
  const bucket = CloudStorageService.bucket
  const blob = bucket.file(req.file.originalname)
  const blobStream = blob.createWriteStream({ gzip: true })
  
  blobStream.on('error', err => {
    next(err)
  })
  
  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = 
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      
    res.status(200).send(publicUrl)
  })
  
  blobStream.end(req.file.buffer)
})

export default router
