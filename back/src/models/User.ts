import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, BaseEntity } from 'typeorm'
import bcrypt from 'bcryptjs'
import Post from '@/models/Post'
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

    static async deleteUser(userId: User['id']) {
      await this.delete({ id: userId })
    }

    static async findByEmail(email: User['email']) {
      const user = await this.findOne({ where: { email } })
      return user
    }

    static async getUserPosts(userId: User['id']) {
      const user = await this.findOne({ where: { id: userId }, relations: ['posts'] })
      return user?.posts
    }
}
