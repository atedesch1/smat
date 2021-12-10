import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/models/comment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  @Input()
  comment!: Comment

  @Output() commentDeleted = new EventEmitter<string>()

  isUsersComment!: boolean
  isEditMode: boolean = false

  constructor(
    private commentService: CommentService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.isUsersComment = this.comment?.user?.id === user.id
    })
  }

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

  toggleEditComment() {
    this.isEditMode = !this.isEditMode
  }

  updateComment(comment: Comment) {
    this.toggleEditComment()
    this.comment = comment
  }

  deleteComment() {
    this.commentService.deleteComment(this.comment.id).subscribe(res => {
      this.commentDeleted.emit(this.comment.id as string)
    })
    // reload page
  }
}
