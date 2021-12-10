import { BaseEntity, Column, DeepPartial, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from '@/models/User'
import Post from '@/models/Post'

@Entity('comments')
export default class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    body!: string

    @Column({ default: 0 })
    like_count!: number

    @ManyToMany(() => User, { nullable: true })
    @JoinTable()
    usersLiked?: User[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date!: Date

    @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
    post!: Post

    @ManyToOne(() => User, { eager: true })
    user!: User

    static async createNew({ body, post, user }:
        {body: Comment['body'], post: Comment['post'], user: Comment['user']}) {
      const newComment = this.create({ body, post, user })
    
      await this.save(newComment)
    
      return newComment
    }

    static async updateComment(comment: Comment, { body }:
        {body?: Comment['body']}) {
      const updatedProperties = this.filterNullProperties({ body })

      const updatedComment = this.create({ ...comment, ...updatedProperties })

      await this.save(updatedComment)

      return updatedComment
    }
  
    static async deleteComment(commentId: Comment['id']) {
      await this.delete({ id: commentId })
    }

    static filterNullProperties(properties: DeepPartial<Comment>) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return Object.fromEntries(Object.entries(properties).filter(([_, v]) => v != null))
    }
}
