import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity, ManyToMany, JoinTable } from 'typeorm'
import User from '@/models/User'
import Comment from './Comment'

@Entity('posts')
export default class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    file!: string // TODO: store real files

    @Column()
    language!: string

    @Column()
    description!: string

    @Column({ nullable: true })
    subject?: string

    @Column({ nullable: true })
    instructor?: string

    @Column({ default: 0 })
    like_count!: number

    @ManyToMany(() => User, { nullable: true })
    @JoinTable()
    usersLiked?: User[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date!: Date

    @ManyToOne(() => User, user => user.posts, { eager: true })
    user!: User

    @OneToMany(() => Comment, comment => comment.post, { nullable: true, cascade: true })
    comments?: Comment[]

    static async createNew({ file, language, description, user, subject, instructor }:
        { file: Post['file'], language: Post['language'], description: Post['description'], user: Post['user'], subject?: Post['subject'], instructor?: Post['instructor'] }) {
      const newPost = this.create({ file, language, description, user, subject, instructor })
  
      await this.save(newPost)
  
      return newPost
    }

    static async updatePost(id: Post['id'], newProperties: Record<string, unknown>) {
      await this.update({ id }, newProperties)
    }

    static async deletePost(id: Post['id']) {
      await this.delete({ id },)
    }
}

