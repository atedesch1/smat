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
import { MatchedPostComponent } from './components/matched-post/matched-post.component';
import { MainComponent } from './views/main/main.component'
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';
import { CreatePostFormComponent } from './components/create-post-form/create-post-form.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    MainComponent,
    MatchedPostComponent,
    CreatePostFormComponent,
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
