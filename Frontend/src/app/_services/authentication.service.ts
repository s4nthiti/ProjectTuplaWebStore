import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { AlertService } from '../_alert/alert.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Profile } from '../_models/Profile';
import { DatePipe } from '@angular/common';
import { catchError, map, retry } from 'rxjs/operators';
import { AuthUser } from '../_models/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject!: BehaviorSubject<User>;
  public currentUser!: Profile;
  userToken: any;
  decodeToken: any;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })};

  constructor(private jwtHelper: JwtHelperService,private fb: FormBuilder, private http: HttpClient,private router: Router,private alertService: AlertService,private datePipe: DatePipe) { }
  readonly BaseURI = 'http://localhost:5000/';
  readonly RegisterURL = 'users/register';
  readonly LoginURL = 'users/login';
  readonly ProfileURL = 'users/profile';
  readonly EditProfileURL = 'users/editprofile';

  loginModel = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  formModel = this.fb.group({
    Email: ['', Validators.email],
    UserName: ['', Validators.required],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords }),
    BirthDate: ['', Validators.required],
    PhoneNumber: ['', [Validators.required,Validators.minLength(10)]]
  });

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.get('Password')!.value;
  let confirmPass = group.get('ConfirmPassword')!.value;

  return pass === confirmPass ? null : { notSame: true }     
}

  register() {
    var body = {
      Email: this.formModel.value.Email,
      UserName: this.formModel.value.UserName,
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
      Password: this.formModel.value.Passwords.Password,
      ConfirmPassword: this.formModel.value.Passwords.ConfirmPassword,
      BirthDate: this.formModel.value.BirthDate,
      PhoneNumber: this.formModel.value.PhoneNumber
    };
    console.log(body);
    return this.http.post(this.BaseURI + this.RegisterURL , body);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  
  login() {
    var body = {
      UserName: this.loginModel.value.UserName,
      Password: this.loginModel.value.Password
    };
    console.log(body);
    return this.http.post<AuthUser>(this.BaseURI + this.LoginURL, body, { headers: new HttpHeaders()
      .set('Content-Type', 'application/json') })
      .pipe(map(user => {
      if (user) {
          localStorage.setItem('token', user.token);
          this.decodeToken = this.jwtHelper.decodeToken(user.token);   // <--- Added
          this.userToken = user.token;
      }
      }));
    }

  logout() {
      if(localStorage.getItem('token') != null)
      {
        if(!this.isTokenExpired())
          this.alertService.success('Logout successful', { autoClose: true, keepAfterRouteChange: true });
        localStorage.removeItem('token');
      }
      this.router.navigate(['']);
    }

  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  isAuthenticated(): boolean {
    if(localStorage.getItem('token') == null)
      return false;
    if(this.isTokenExpired())
    {
      this.logout();
      return false;
    }
    return true;
  }
  
  isTokenExpired(): boolean {
    const getToken = localStorage.getItem('token');
    const token = JSON.stringify(getToken);
    console.log("Token " + this.jwtHelper.isTokenExpired(token));
    return this.jwtHelper.isTokenExpired(token);
  }

  getUserProfile():Observable<Profile> {
    return this.http.get<Profile>(this.BaseURI + this.ProfileURL, this.httpOptions);
  }

  transformDate(birthdate: Date)
  {
    return this.datePipe.transform(birthdate, 'yyyy-MM-dd');
  }

  updateProfile(data: any){
    return this.http.post(this.BaseURI + this.EditProfileURL, data, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
    );
  }

  loggedIn() {
    const token = this.jwtHelper.tokenGetter();
    if (!token) {
        return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

}