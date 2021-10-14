import { User } from './user'

export interface Post {
  id: string,
  fileURL: string,
  language: string,
  title: string,
  description: string,
  subject: string,
  instructor: string,
  like_count: number,
  date: Date,
  user: User
}
