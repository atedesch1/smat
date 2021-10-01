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
}
