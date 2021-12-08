import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  updatePost(postId: String, formData: any) {
    return this.http.put(`${this.postUrl}/${postId}`, formData)
  }

  deletePost(postId: String) {
    return this.http.delete(`${this.postUrl}/${postId}`)
  }

  getMatchedPosts(searchQuery: String) {
    return this.http.get<Post[]>(`${this.postUrl}/search/${searchQuery}`)
  }

  getAPost(postId: String) {
    return this.http.get(`${this.postUrl}/${postId}`)
  }

  getPostComments(postId: String) {
    return this.http.get(`${this.postUrl}/${postId}/comments`)
  }

  hasLikedPost(postId: String) {
    return this.http.get(`${this.postUrl}/${postId}/like`)
  }

  likePost(postId: String) {
    return this.http.put(`${this.postUrl}/${postId}/like`, null)
  }

  unlikePost(postId: String) {
    return this.http.delete(`${this.postUrl}/${postId}/like`)
  }

}
