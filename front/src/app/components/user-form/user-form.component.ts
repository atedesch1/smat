import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import nationalitiesJSON  from 'src/assets/nationalities.json'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  nationalities = nationalitiesJSON.nationatilies

  user!: User
  userForm!: FormGroup

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user
      this.setFormGroup()
    })
    this.setFormGroup()
  }

  setFormGroup() {
    this.userForm = this.fb.group({
      file: [
        null,
        [
          Validators.required,
      ]],
      name: [
        this.user?.name ?? '',
        [
          Validators.required,
      ]],
      nationality: [
        this.user?.nationality ?? '',
        [
          Validators.required,
      ]],
      bio: [
        this.user?.bio ?? '',
        [
          Validators.required,
      ]],
    })
  }

  get file() {
    return this.userForm.get('file')
  }
  get name() {
    return this.userForm.get('name')
  }
  get nationality() {
    return this.userForm.get('nationality')
  }
  get bio() {
    return this.userForm.get('bio')
  }

  onFileChange(event: any) {
    if (event?.target?.files?.length) {
      const file = event.target.files[0];
      this.userForm.patchValue({
          file: file,
      })
    }
  }

  async submitHandler() {
    let formValue = this.userForm.value

    const formData = new FormData()
    formData.append('file', formValue.file)
    formData.append('name', formValue.name)
    formData.append('nationality', formValue.nationality)
    formData.append('bio', formValue.bio)

    try {
      this.userService.updateUser(formData).subscribe(res => {
        this.router.navigateByUrl('/main/user')
      })
    } catch (e) {
      console.error(e)
    }
  }
}
