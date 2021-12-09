import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentUrl = '/api/comment'

  constructor(private http: HttpClient) { }

  createComment(postId: string, formValue: any) {
    return this.http.post(`${this.commentUrl}/${postId}`, formValue)
  }

  getAComment(commentId: string) {
    return this.http.get<Comment>(`${this.commentUrl}/${commentId}`)
  }

  updateComment(commentId: string, formValue: any) {
    return this.http.put(`${this.commentUrl}/${commentId}`, formValue)
  }

  deleteComment(commentId: string) {
    return this.http.delete(`${this.commentUrl}/${commentId}`)
  }

  hasLikedComment(commentId: string) {
    return this.http.get<string>(`${this.commentUrl}/${commentId}/like`).pipe(
      map(hasLikedComment => { return hasLikedComment === 'true' })
    )
  }

  likeComment(commentId: string) {
    return this.http.put(`${this.commentUrl}/${commentId}/like`, null)
  }

  unlikeComment(commentId: string) {
    return this.http.delete(`${this.commentUrl}/${commentId}/like`)
  }

}
