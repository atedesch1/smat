import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, BaseEntity, OneToOne, JoinColumn } from 'typeorm'
import bcrypt from 'bcryptjs'
import Post from '@/models/Post'
import Session from '@/models/Session'
@Entity('users')
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @Column()
    name!: string

    @Column()
    nationality!: string // Use somekind of Country

    @Column({ nullable: true })
    profilePicture?: string // TODO: store real images

    @Column({ nullable: true })
    bio?: string

    @OneToMany(() => Post, post => post.user, { nullable: true })
    posts?: Post[]

    @OneToOne(() => Session, session => session.user, { nullable: true })
    @JoinColumn()
    session?: Session

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 12)
    }

    static async createNew(email: User['email'], password: User['password'], name: User['name'], nationality: User['nationality']) {
      const newUser = this.create({ email, password, name, nationality })

      await this.save(newUser)

      return newUser
    }

    static async updateUser(id: User['id'], newProperties: Record<string, unknown>) {
      await User.update({ id }, newProperties)
    }

    static async deleteUser(id: User['id']) {
      await this.delete({ id })
    }

    static async findByEmail(email: User['email']) {
      const user = await this.findOne({ where: { email } })
      return user
    }
}
