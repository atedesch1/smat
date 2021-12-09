import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './views/home/home.component'
import { AuthComponent } from './views/auth/auth.component'
import { LocalStorageService } from './services/local-storage.service';
import { MainComponent } from './views/main/main.component'
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';
import { CreateOrUpdatePostFormComponent } from './components/create-or-update-post-form/create-or-update-post-form.component';
import { PostsComponent } from './components/posts/posts.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PostComponent } from './components/post/post.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { CreateOrUpdateCommentFormComponent } from './components/create-or-update-comment-form/create-or-update-comment-form.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { EditUserFormComponent } from './components/edit-user-form/edit-user-form.component';
import { UserComponent } from './components/user/user.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    MainComponent,
    CreateOrUpdatePostFormComponent,
    PostsComponent,
    NavBarComponent,
    SearchBarComponent,
    PostComponent,
    PostCardComponent,
    CommentCardComponent,
    CreateOrUpdateCommentFormComponent,
    SideBarComponent,
    UserCardComponent,
    EditUserFormComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [LocalStorageService, AuthInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
