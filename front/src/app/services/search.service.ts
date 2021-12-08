import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../models/post';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  postUrl = '/api/post'

  constructor(private http: HttpClient) { }

  search(searchQuery: string): Observable<Post[]> {
    let params = new HttpParams().set('searchQuery', searchQuery)

    return this.http.get<Post[]>(`${this.postUrl}/search`, { params })
  }
}
