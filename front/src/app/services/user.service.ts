import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'api/user'

  constructor(
    private http: HttpClient,
  ) { }

  searchUsers(searchQuery: string) {
    let params = new HttpParams().set('searchQuery', searchQuery)
    return this.http.get<User[]>(`${this.userUrl}/search`, { params })
  }

  updateUser(formData: any) {
    return this.http.put(`${this.userUrl}`, formData)
  }

  deleteUser() {
    return this.http.delete(`${this.userUrl}`)
  }

  getCurrentUser() {
    return this.http.get<User>(`${this.userUrl}/session`)
  }

  getAUser(userId: string) {
    return this.http.get<User>(`${this.userUrl}/${userId}`)
  }

  getUserPosts(userId:string) {
    return this.http.get<Post[]>(`${this.userUrl}/${userId}/posts`)
  }
}
