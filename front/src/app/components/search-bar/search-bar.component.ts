import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  searchQuery: string = ''
  posts: Post[] = []

  constructor(
    private postService: PostService,
    private router: Router,
  ) { }

  ngOnInit(): void {}

  search() {
    if (this.searchQuery === '') {
      this.posts = []
      return
    }

    this.postService.searchPosts(this.searchQuery).subscribe(
      posts => {
        this.posts = posts
    })
  }

  onEnter() {
    this.router.navigateByUrl(`/main?searchQuery=${this.searchQuery}`)
    this.searchQuery = ''
    this.posts = []
  }

}
