import Multer from 'multer'

class MulterMiddleware {
    multer!: Multer.Multer

    constructor() {
      this.multer = Multer({
        storage: Multer.memoryStorage(),
        limits: {
          fileSize: 5 * 1024 * 1024, // max 5mb
        },
      })
    }
}

export default new MulterMiddleware()
