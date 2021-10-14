import { Component, NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchQuery = ''
  // matchedPosts: Observable<Post[]> | undefined
  matchedPosts: Post[] = []

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  async getMatchedPosts() {
    if (this.searchQuery === '') {
      this.matchedPosts = []
      return
    }

    // this.searchService.search(this.searchQuery).subscribe(res => { this.matchedPosts = res })
    this.matchedPosts = await this.searchService.search(this.searchQuery).toPromise()
  }

  // getMatchedPosts(): void {
  //   if (this.searchQuery === '') {
  //     this.matchedPosts = new Observable<Post[]>()
  //     return
  //   }

  //   this.matchedPosts = this.searchService.search(this.searchQuery)
  // }

}
