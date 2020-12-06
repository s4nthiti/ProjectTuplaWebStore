import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { EditprofileComponent } from './profile/editprofile/editprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_helpers/auth.guard';
import { GuestGuard } from './_helpers/guest.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  {path: 'logout', component: LogoutComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'editprofile', component: EditprofileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
