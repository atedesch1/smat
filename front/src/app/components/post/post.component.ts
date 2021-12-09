import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { Comment } from 'src/app/models/comment';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post!: Post
  postId!: string

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = params.id
      this.postService.getAPost(this.postId).subscribe(post => {
        this.post = post
      })
    })
  }

  updateComment(comment: Comment): void {
    const { comments } = this.post

    const savedComment = comments?.find(c => c.id === comment.id)

    if (savedComment) {
      this.post.comments = this.post?.comments?.map(c => {
        return c.id === comment.id ? comment : c
      })
    } else {
      this.post.comments = [...this.post.comments, comment]
    }
  }
}
