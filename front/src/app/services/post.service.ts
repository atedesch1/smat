import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postUrl = '/api/post'

  constructor(private http: HttpClient) { }

  createPost(formData: any){
    return this.http.post(`${this.postUrl}/create`, formData)
  }

}
