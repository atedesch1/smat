import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { AuthComponent } from './views/auth/auth.component';
import { HomeComponent } from './views/home/home.component';
import { MainComponent } from './views/main/main.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'auth', component: AuthComponent, },
  { path: 'main', component: MainComponent,
  //  canActivate: [IsAuthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
