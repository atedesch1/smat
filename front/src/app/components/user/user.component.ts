import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post'
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user!: User
  userId?: string
  userPosts: Post[] = []

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const getUser$ = params.id
        ? this.userService.getAUser(params.id)
        : this.userService.getCurrentUser()

      getUser$.subscribe(user => {
        this.user = user

        this.userService.getUserPosts(user.id).subscribe(posts => {
          this.userPosts = posts
        })
      })
    })
  }
}
