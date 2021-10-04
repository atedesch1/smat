import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity, ManyToMany, JoinTable } from 'typeorm'
import User from '@/models/User'
import Comment from './Comment'

@Entity('posts')
export default class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    fileURL!: string

    @Column()
    language!: string

    @Column()
    title!: string

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

    static async createNew({ fileURL, language, title, description, user, subject, instructor }:
        { fileURL: Post['fileURL'], language: Post['language'], title: Post['title'], description: Post['description'], user: Post['user'], subject?: Post['subject'], instructor?: Post['instructor'] }) {
      const postInfo = this.filterNullProperties({ fileURL, language, description, title, user, subject, instructor })
      
      const newPost = this.create(postInfo)
  
      await this.save(newPost)
  
      return newPost
    }

    static async updatePost(id: Post['id'], { fileURL, language, title, description, subject, instructor }:
        { fileURL?: Post['fileURL'], language?: Post['language'], title?: Post['title'], description?: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] }) {
      const updatedProperties = this.filterNullProperties({ fileURL, language, title, description, subject, instructor })

      await this.update({ id }, updatedProperties)
    }

    static async deletePost(id: Post['id']) {
      await this.delete({ id })
    }

    static filterNullProperties(properties: Record<string, unknown>) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return Object.fromEntries(Object.entries(properties).filter(([_, v]) => v != null))
    }
}

