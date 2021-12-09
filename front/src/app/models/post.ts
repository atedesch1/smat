import { User } from './user'
import { Comment } from './comment'

export class Post {
  id: string
  fileURL?: string
  language?: string
  title?: string
  description?: string
  subject?: string
  instructor?: string
  like_count: number = 0
  date?: Date
  user?: User
  comments: Comment[]

  constructor(post: Partial<Post>) {
    Object.assign(this, post)

    this.id = post.id || ''

    this.comments = post.comments || []
  }
}
