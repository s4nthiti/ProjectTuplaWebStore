import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';;
import { AlertComponent } from './_alert/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { JwtModule } from '@auth0/angular-jwt';;
import { ProfileComponent } from './profile/profile.component'
import { DatePipe } from '@angular/common';;
import { EditprofileComponent } from './profile/editprofile/editprofile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';;
import { PublisherRegisterComponent } from './publisher-register/publisher-register.component';
import { VerifyPublisherComponent } from './admin/verify-publisher/verify-publisher.component';;
import { PublisherRequestComponent } from './admin/publisher-request/publisher-request.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    AlertComponent,
    LogoutComponent,
    ProfileComponent,
    EditprofileComponent,
    PublisherRegisterComponent,
    VerifyPublisherComponent,
    PublisherRequestComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
      }
    }),
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
