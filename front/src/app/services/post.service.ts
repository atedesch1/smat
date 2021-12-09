import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postUrl = '/api/post'

  constructor(private http: HttpClient) { }

  createPost(formData: any) {
    return this.http.post(`${this.postUrl}/create`, formData)
  }

  updatePost(postId: string, formData: any) {
    return this.http.put(`${this.postUrl}/${postId}`, formData)
  }

  deletePost(postId: string) {
    return this.http.delete<void>(`${this.postUrl}/${postId}`)
  }

  searchPosts(searchQuery: string) {
    let params = new HttpParams().set('searchQuery', searchQuery)
    return this.http.get<Post[]>(`${this.postUrl}/search`, { params })
  }

  getAPost(postId: string) {
    return this.http.get<Post>(`${this.postUrl}/${postId}`)
  }

  getPostComments(postId: string) {
    return this.http.get(`${this.postUrl}/${postId}/comments`)
  }

  hasLikedPost(postId: string) {
    return this.http.get<string>(`${this.postUrl}/${postId}/like`).pipe(
      map(hasLikedPost => { return hasLikedPost === 'true' })
    )
  }

  likePost(postId: string) {
    return this.http.put(`${this.postUrl}/${postId}/like`, null)
  }

  unlikePost(postId: string) {
    return this.http.delete(`${this.postUrl}/${postId}/like`)
  }

}
