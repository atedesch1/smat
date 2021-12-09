import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = []

  postsSubscription?: Subscription

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.postsSubscription = this.postService.searchPosts(params.searchQuery || '')
        .subscribe(posts => (this.posts = posts))
    })
  }

  ngOnDestroy(): void {
    this.postsSubscription?.unsubscribe()
  }

}
