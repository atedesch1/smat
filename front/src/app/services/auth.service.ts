import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { SignInResponse } from '../models/sign-in-response';
import { tap } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false)
  isLoggedIn = this._isLoggedIn.asObservable()
  private readonly TOKEN_NAME = 'auth-token'

  userUrl = '/api/user'

  get token() { return this.localStorage.get(this.TOKEN_NAME) }

  constructor(private http: HttpClient,
    private localStorage: LocalStorageService) {
      const token = this.localStorage.get(this.TOKEN_NAME)
      // Verify if token is not expired !
      this._isLoggedIn.next(!!this.token)
    }

  signUp(formValue: any) {
    return this.http.post(`${this.userUrl}/sign-up`, formValue)
  }

  signIn(formValue: any) {
    return this.http.post<SignInResponse>(`${this.userUrl}/sign-in`, formValue).pipe(
      tap(res => {
        this.localStorage.set(this.TOKEN_NAME, res.token)
        this._isLoggedIn.next(true)
      })
    )
  }

}
