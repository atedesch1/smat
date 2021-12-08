import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss']
})
export class CreatePostFormComponent implements OnInit {

  createPostForm!: FormGroup

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createPostForm = this.fb.group({
      file: [null, [
        Validators.required,
      ]],
      title: ['', [
        Validators.required,
      ]],
      language: ['', [
        Validators.required,
      ]],
      description: ['', [
        Validators.required,
      ]],
      subject: ['', [
        Validators.maxLength(10),
      ]],
      instructor: ['', [
        Validators.maxLength(20),
      ]]
    })
  }

  get file() {
    return this.createPostForm.get('file')
  }
  get title() {
    return this.createPostForm.get('title')
  }
  get language() {
    return this.createPostForm.get('language')
  }
  get description() {
    return this.createPostForm.get('description')
  }
  get subject() {
    return this.createPostForm.get('subject')
  }
  get instructor() {
    return this.createPostForm.get('instructor')
  }

  onFileChange(event: any) {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createPostForm.patchValue({
          file: file
      })
    }
  }


  async submitHandler() {
    let formValue = this.createPostForm.value

    const formData = new FormData()
    formData.append('file', formValue.file)
    formData.append('title', formValue.title)
    formData.append('language', formValue.language)
    formData.append('description', formValue.description)
    formData.append('subject', formValue.subject)
    formData.append('instructor', formValue.instructor)

    try {
      this.postService.createPost(formData).subscribe()
    } catch (e) {
      console.error(e)
    }
  }
}
