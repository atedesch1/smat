import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input()
  post!: Post

  constructor(
    private postService: PostService,
    private router: Router,
  ) { }

  ngOnInit(): void {}

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
    this.postService.deletePost(this.post.id).subscribe()
    this.router.navigateByUrl('/main')
  }
}
