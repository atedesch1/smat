import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  @Input()
  comment!: Comment

  constructor(
    private commentService: CommentService,
  ) { }

  ngOnInit(): void {}

  toggleLikeComment() {
    this.commentService.hasLikedComment(this.comment.id).subscribe(hasLikedComment => {
      if (!hasLikedComment) {
        this.commentService.likeComment(this.comment.id).subscribe()
        this.comment.like_count = this.comment.like_count + 1
      }
      else {
        this.commentService.unlikeComment(this.comment.id).subscribe()
        this.comment.like_count = this.comment.like_count - 1
      }
    })
  }

  deleteComment() {
    this.commentService.deleteComment(this.comment.id).subscribe()
    // reload page
  }
}
