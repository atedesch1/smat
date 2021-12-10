import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input()
  post!: Post

  isUsersPost!: boolean

  constructor(
    private postService: PostService,
    private userService: UserService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.isUsersPost = this.post?.user?.id === user.id
    })
  }

  toggleLikePost() {
    this.postService.hasLikedPost(this.post.id).subscribe(hasLikedPost => {
      if (!hasLikedPost) {
        this.postService.likePost(this.post.id).subscribe()
        this.post.like_count = this.post.like_count + 1
      }
      else {
        this.postService.unlikePost(this.post.id).subscribe()
        this.post.like_count = this.post.like_count - 1
      }
    })
  }

  deletePost() {
    this.postService.deletePost(this.post.id).subscribe(res => {
      // should emit event
      this.router.navigateByUrl('/main')
    })
  }
}
