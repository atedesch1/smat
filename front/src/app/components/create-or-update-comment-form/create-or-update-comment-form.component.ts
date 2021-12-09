import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-create-or-update-comment-form',
  templateUrl: './create-or-update-comment-form.component.html',
  styleUrls: ['./create-or-update-comment-form.component.scss']
})
export class CreateOrUpdateCommentFormComponent implements OnInit {

  @Input()
  postId!: string

  @Output() commentChanged = new EventEmitter<Comment>()

  commentForm!: FormGroup
  comment?: Comment

  isSaving = false

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
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

  async submitHandler() {
    let formValue = this.commentForm.value
    this.isSaving = true

    try {
      const call$ = this.comment
        ? this.commentService.updateComment(this.comment.id, formValue)
        : this.commentService.createComment(this.postId, formValue)

      call$.subscribe(comment => {
        console.log('comment', comment)
        this.commentChanged.emit(comment as Comment)
        this.isSaving = false
      })
    } catch (e) {
      console.error(e)
    }
  }

}
