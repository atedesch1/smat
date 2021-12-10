import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity, ManyToMany, JoinTable, DeepPartial } from 'typeorm'
import User from '@/models/User'
import Comment from './Comment'

@Entity('posts')
export default class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    fileURL!: string

    @Column()
    filePreviewURL!: string

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

    static async createNew({ fileURL, filePreviewURL, language, title, description, user, subject, instructor }:
        { fileURL: Post['fileURL'], filePreviewURL: Post['filePreviewURL'], language: Post['language'], title: Post['title'], description: Post['description'], user: Post['user'], subject?: Post['subject'], instructor?: Post['instructor'] }) {
      const postInfo = this.filterNullProperties({ fileURL, filePreviewURL, language, description, title, user, subject, instructor })
      
      const newPost = this.create(postInfo)
  
      await this.save(newPost)
  
      return newPost
    }

    static async updatePost(post: Post, { fileURL, filePreviewURL, language, title, description, subject, instructor }:
        { fileURL?: Post['fileURL'], filePreviewURL?: Post['filePreviewURL'], language?: Post['language'], title?: Post['title'], description?: Post['description'], subject?: Post['subject'], instructor?: Post['instructor'] }) {
      const updatedProperties = this.filterNullProperties({ fileURL, filePreviewURL, language, title, description, subject, instructor })

      const updatedPost = this.create({ ...post, ...updatedProperties })

      await this.save(updatedPost)

      return updatedPost
    }

    static async deletePost(id: Post['id']) {
      await this.delete({ id })
    }

    static filterNullProperties(properties: DeepPartial<Post>) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return Object.fromEntries(Object.entries(properties).filter(([_, v]) => v != null))
    }
}

