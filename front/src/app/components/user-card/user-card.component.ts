import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  user!: User

  constructor(
    private userService: UserService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user
    })
  }

}
