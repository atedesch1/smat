import { User } from './user'

export interface Comment {
  id: string,
  body: string,
  like_count: number,
  date: Date,
  // postId: string,
  // userId: string,
  user: User,
}
