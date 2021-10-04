import fs from 'fs'
import path from 'path'
import { Bucket, Storage } from '@google-cloud/storage'

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
        }
      }
              
      const storage = new Storage(storageOptions)
            
      this.bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || '')
    }
}

export default new CloudStorageService()
