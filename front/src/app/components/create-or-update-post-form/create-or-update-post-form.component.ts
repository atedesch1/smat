import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-create-or-update-post-form',
  templateUrl: './create-or-update-post-form.component.html',
  styleUrls: ['./create-or-update-post-form.component.scss']
})
export class CreateOrUpdatePostFormComponent implements OnInit {

  postForm!: FormGroup
  post?: Post

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        const postId = params.id
        this.postService.getAPost(postId).subscribe((post: Post) => {
          this.post = post
          this.setFormGroup()
        })
      }
      this.setFormGroup()
    })
  }

  setFormGroup() {
    this.postForm = this.fb.group({
      file: [
        null,
        [
          Validators.required,
      ]],
      title: [
        this.post?.title ?? '',
        [
          Validators.required,
      ]],
      language: [
        this.post?.language ?? '',
        [
          Validators.required,
      ]],
      description: [
        this.post?.description ?? '',
        [
          Validators.required,
      ]],
      subject: [
        this.post?.subject ?? '',
        [
          Validators.maxLength(10),
      ]],
      instructor: [
        this.post?.instructor ?? '',
        [
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
    if (event?.target?.files?.length) {
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
      const call$ = this.post
        ? this.postService.updatePost(this.post.id, formData)
        : this.postService.createPost(formData)

        call$.subscribe(post => {
          this.router.navigate(['/main/post', post.id])
        })
    } catch (e) {
      console.error(e)
    }
  }
}
