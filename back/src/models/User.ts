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
    pictureURL?: string

    @Column({ nullable: true })
    bio?: string

    @OneToMany(() => Post, post => post.user, { nullable: true, cascade: true })
    posts?: Post[]

    @OneToOne(() => Session, session => session.user, { nullable: true })
    session?: Session

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 12)
    }

    static async createNew({ email, password, name, nationality }:
        {email: User['email'], password: User['password'], name: User['name'], nationality: User['nationality']}) {
      const newUser = this.create({ email, password, name, nationality })

      await this.save(newUser)

      return newUser
    }

    static async updateUser(id: User['id'], { name, nationality, bio, pictureURL }:
        { name?: User['name'], nationality?: User['nationality'], bio?: User['bio'], pictureURL?: User['pictureURL'] }) {
      const updatedProperties = this.filterNullProperties({ name, nationality, bio, pictureURL })

      await this.update({ id }, updatedProperties)
    }

    static async deleteUser(id: User['id']) {
      await this.delete({ id })
    }

    static filterNullProperties(properties: Record<string, unknown>) {
      return Object.fromEntries(Object.entries(properties).filter(([_, v]) => v != null))
    }

    static async findByEmail(email: User['email']) {
      const user = await this.findOne({ where: { email } })
      return user
    }
}
