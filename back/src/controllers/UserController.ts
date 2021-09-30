import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../models/User'

class UserController {
  index(req: Request, res: Response) {
    return res.send({ userID: req.userId })
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User)
    const { email, password } = req.body

    const userExists = await repository.findOne({ where: { email } })

    if (userExists) { return res.sendStatus(409) }

    const newUser = repository.create({ email, password })
    await repository.save(newUser)

    return res.json(newUser)
  }
}

export default new UserController()
