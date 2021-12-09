import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrUpdatePostFormComponent } from './components/create-or-update-post-form/create-or-update-post-form.component';
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components/posts/posts.component';
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
            component: CreateOrUpdatePostFormComponent,
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
                component: CreateOrUpdatePostFormComponent,
              },
            ],
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
