import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-create-or-update-post-form',
  templateUrl: './create-or-update-post-form.component.html',
  styleUrls: ['./create-or-update-post-form.component.scss']
})
export class CreateOrUpdatePostFormComponent implements OnInit {

  postForm!: FormGroup

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
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
    return this.postForm.get('file')
  }
  get title() {
    return this.postForm.get('title')
  }
  get language() {
    return this.postForm.get('language')
  }
  get description() {
    return this.postForm.get('description')
  }
  get subject() {
    return this.postForm.get('subject')
  }
  get instructor() {
    return this.postForm.get('instructor')
  }

  onFileChange(event: any) {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.postForm.patchValue({
          file: file
      })
    }
  }


  async submitHandler() {
    let formValue = this.postForm.value

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
