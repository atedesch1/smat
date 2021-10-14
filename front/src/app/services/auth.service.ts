import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { SignInResponse } from '../models/sign-in-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userUrl = '/api/user'

  constructor(private http: HttpClient,
    private localStorage: LocalStorageService) {}

  signUp(formValue: any) {
    return this.http.post(`${this.userUrl}/sign-up`, formValue).subscribe()
  }

  signIn(formValue: any) {
    return this.http.post<SignInResponse>(`${this.userUrl}/sign-in`, formValue)
      .subscribe(res => {
        this.localStorage.set('token', res.token)
      })
  }

}
