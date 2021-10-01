import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from '@/models/User'
import Post from '@/models/Post'

@Entity('comments')
export default class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    body!: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date!: Date

    @ManyToOne(() => Post, post => post.comments)
    post!: Post

    @ManyToOne(() => User)
    user!: User

    static async createNew({ body, post, user }:
        {body: Comment['body'], post: Comment['post'], user: Comment['user']}) {
      const newComment = this.create({ body, post, user })
    
      await this.save(newComment)
    
      return newComment
    }
  
    static async deleteComment(commentId: Comment['id']) {
      await this.delete({ id: commentId })
    }
}
