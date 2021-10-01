import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity } from 'typeorm'
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

    @Column()
    like_count!: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date!: Date

    @ManyToOne(() => User, user => user.posts)
    user!: User

    @OneToMany(() => Comment, comment => comment.post, { nullable: true })
    comments?: Comment[]
}

