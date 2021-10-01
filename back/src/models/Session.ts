import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import User from '@/models/User'

@Entity('sessions')
export default class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  token!: string;

  @OneToOne(() => User, user => user.session)
  @JoinColumn()
  user?: User

  static async createNew(user: Session['user'], token: Session['token']) {
    const session = this.create({ user, token })

    await session.save()

    return session
  }

  static async deleteSession(id: Session['id']) {
    this.delete({ id })
  }
}
