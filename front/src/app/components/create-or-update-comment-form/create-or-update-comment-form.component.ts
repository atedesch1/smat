import { Component, Input, OnInit } from '@angular/core';
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

  commentForm!: FormGroup
  comment?: Comment

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

    try {
      if (this.comment)
        this.commentService.updateComment(this.comment.id, formValue).subscribe()
      else
        this.commentService.createComment(this.postId, formValue).subscribe()
    } catch (e) {
      console.error(e)
    }
  }

}
