import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Bucket, CreateWriteStreamOptions, Storage } from '@google-cloud/storage'

class CloudStorageService {
    bucket!: Bucket
    
    constructor() {
      if (process.env.NODE_ENV === 'development') {
        const data = fs.readFileSync(path.join(__dirname, '../../smat-keys.json'))
        const keys: string = JSON.parse(data.toString())
        process.env.GCLOUD_PROJECT_ID = keys['project_id']
        process.env.GCLOUD_CLIENT_EMAIL = keys['client_email']
        process.env.GCLOUD_STORAGE_BUCKET = keys['storage_bucket']
        process.env.GCLOUD_PRIVATE_KEY = keys['private_key']
      }
              
      const storageOptions = {
        projectId: process.env.GCLOUD_PROJECT_ID,
        credentials: {
          client_email: process.env.GCLOUD_CLIENT_EMAIL,
          private_key: (process.env.GCLOUD_PRIVATE_KEY || '').replace(/\\n/gm, '\n')
        },

      }
              
      const storage = new Storage(storageOptions)

      this.bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || '')

      console.log(this.bucket ? 'Successfully connected to Google Cloud Storage Bucket' : 'Couldn\'t connect to Google Cloud Storage Bucket')
    }

    uploadFile(file: Express.Multer.File, folderName: string, options: CreateWriteStreamOptions) {
      return new Promise<string>((resolve, reject) => {
        const { originalname, buffer } = file
      
        const fileId = uuidv4()

        const blob = this.bucket.file(`${folderName}/${fileId}&${originalname.replace(/ /g, '_')}`)
        const blobStream = blob.createWriteStream(options)
        
        blobStream.on('finish', () => {
          const publicURL = 
            `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`
          resolve(publicURL)
        })
          .on('error', () => {
            reject('Unable to upload file')
          })
          .end(buffer)
      })
    }

    async deleteFile(fileURL: string) {
      try {
        const blob = this.bucket.file(fileURL.slice(42))
        await blob.delete() 
      } catch (err) {
        throw new Error('Unable to delete file')
      }
    }
}

export default new CloudStorageService()
