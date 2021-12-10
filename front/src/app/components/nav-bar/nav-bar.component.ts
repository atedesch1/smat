import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() hideSearch = false

  constructor(
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  signIn() {
    this.router.navigateByUrl('auth')
  }

  signUp() {
    this.router.navigateByUrl('auth')
  }

  signOut() {
    this.authService.signOut()
  }
}
