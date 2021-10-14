import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-matched-post',
  templateUrl: './matched-post.component.html',
  styleUrls: ['./matched-post.component.scss']
})
export class MatchedPostComponent implements OnInit {

  @Input()
  post!: Post

  constructor() { }

  ngOnInit(): void {
  }

}
