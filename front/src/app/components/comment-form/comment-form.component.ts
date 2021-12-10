import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/models/comment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Input()
  postId!: string

  @Input()
  comment?: Comment

  @Output() editCommentClosed = new EventEmitter<void>()
  @Output() commentChanged = new EventEmitter<Comment>()

  commentForm!: FormGroup
  user!: User

  isSaving = false

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user
    })
    this.commentForm = this.fb.group({
      body: [
        this.comment?.body ?? '',
        [
          Validators.required,
      ]],
    })
  }

  get body() {
    return this.commentForm.get('body')
  }

  closeCommentEditor() {
    this.editCommentClosed.emit()
  }

  async submitHandler() {
    if (this.commentForm.value.body) {
      let formValue = this.commentForm.value
      this.isSaving = true

      try {
        const call$ = this.comment
          ? this.commentService.updateComment(this.comment.id, formValue)
          : this.commentService.createComment(this.postId, formValue)

        call$.subscribe(comment => {
          this.commentChanged.emit(comment as Comment)
          this.isSaving = false
          this.commentForm.patchValue({
            body: ''
          })
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

}
