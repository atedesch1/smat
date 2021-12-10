import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostFormComponent } from './components/post-form/post-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components/posts/posts.component';
import { UserComponent } from './components/user/user.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { AuthComponent } from './views/auth/auth.component';
import { HomeComponent } from './views/home/home.component';
import { MainComponent } from './views/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: '',
        component: PostsComponent,
      },
      {
        path: 'post',
        children: [
          {
            path: 'create',
            component: PostFormComponent,
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                component: PostComponent,
              },
              {
                path: 'edit',
                component: PostFormComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            component: UserComponent,
          },
          {
            path: 'edit',
            component: UserFormComponent,
          },
          {
            path: ':id',
            component: UserComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
