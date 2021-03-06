import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import nationalitiesJSON  from 'src/assets/nationalities.json'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isSignUp!: boolean
  authForm!: FormGroup
  isLoading = false
  isSuccess = false

  nationalities = nationalitiesJSON.nationatilies

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    const state: any = this.location.getState()
    this.isSignUp = state? state.isSignUp : true

    this.authForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
      ]],
      name: ['', [
        Validators.required
      ]],
      nationality: ['', [
        Validators.required
      ]]
    })
  }

  get email() {
    return this.authForm.get('email')
  }

  get password() {
    return this.authForm.get('password')
  }

  get name() {
    return this.authForm.get('name')
  }

  get nationality() {
    return this.authForm.get('nationality')
  }

  async submitHandler() {
    this.isLoading = true

    let formValue = this.authForm.value

    try {
      if (this.isSignUp) {
        this.authService.signUp(formValue).subscribe()
        this.isSignUp = false
      } else {
        delete formValue.name
        delete formValue.nationality
        this.authService.signIn(formValue).subscribe()
        this.router.navigateByUrl('/')
      }
    } catch (err: any) {
      console.error(err)
    }

    this.isLoading = false
  }

}
