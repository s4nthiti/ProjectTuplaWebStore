import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublisherRequestComponent } from './admin/publisher-request/publisher-request.component';
import { VerifyPublisherComponent } from './admin/verify-publisher/verify-publisher.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { EditprofileComponent } from './profile/editprofile/editprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { PublisherRegisterComponent } from './publisher-register/publisher-register.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_helpers/auth.guard';
import { GuestGuard } from './_helpers/guest.guard';
import { Role } from './_models/role';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  {path: 'logout', component: LogoutComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'editprofile', component: EditprofileComponent, canActivate: [AuthGuard]},
  {path: 'publisher-register', component: PublisherRegisterComponent, canActivate: [AuthGuard], data: { roles: [Role.User]}},
  {path: 'admin' ,canActivate: [AuthGuard], data: { roles: [Role.Admin] },
    children: [
      { path: 'verify-publisher/:RequestID', component: VerifyPublisherComponent },
      { path: 'publisher-request', component: PublisherRequestComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
