import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Post } from '../models/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postUrl = '/api/post'

  constructor(private http: HttpClient) { }

  createPost(formData: any): Observable<Post> {
    return this.http.post(`${this.postUrl}/create`, formData).pipe(
      map((post: any) => new Post(post))
    )
  }

  updatePost(postId: string, formData: any): Observable<Post> {
    return this.http.put(`${this.postUrl}/${postId}`, formData).pipe(
      map((post: any) => new Post(post))
    )
  }

  deletePost(postId: string) {
    return this.http.delete<void>(`${this.postUrl}/${postId}`)
  }

  searchPosts(searchQuery: string) {
    let params = new HttpParams().set('searchQuery', searchQuery)
    return this.http.get<Post[]>(`${this.postUrl}/search`, { params })
  }

  getAPost(postId: string): Observable<Post> {
    return this.http.get<Post>(`${this.postUrl}/${postId}`).pipe(
      map((post: any) => new Post(post))
    )
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
