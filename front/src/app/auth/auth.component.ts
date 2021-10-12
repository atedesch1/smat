import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isSignUp: boolean | undefined

  constructor(private location:Location) {
   }

  ngOnInit(): void {
    const state: any = this.location.getState()
    this.isSignUp = state? state.isSignUp : true
  }

}
