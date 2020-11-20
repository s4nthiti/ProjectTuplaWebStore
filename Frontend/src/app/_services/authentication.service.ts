import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { AlertService } from '../_alert/alert.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject!: BehaviorSubject<User>;
  public currentUser!: Observable<User>;

  constructor(public jwtHelper: JwtHelperService,private fb: FormBuilder, private http: HttpClient,private router: Router,private alertService: AlertService) { }
  readonly BaseURI = 'http://localhost:5000/';
  readonly RegisterURL = 'users/register';
  readonly LoginURL = 'users/login';

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
    return this.http.post(this.BaseURI + this.LoginURL, body);
  }

  logout() {
    if(localStorage.getItem('token') != null)
    {
      localStorage.removeItem('token');
      this.alertService.success('Logout successful', { autoClose: true, keepAfterRouteChange: true });
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
    return localStorage.getItem('token') != null && !this.isTokenExpired();
  }
  
  isTokenExpired(): boolean {
    const getToken = localStorage.getItem('token');
    const token = JSON.stringify(getToken);
    console.log("Token " + this.jwtHelper.isTokenExpired(token));
    return this.jwtHelper.isTokenExpired(token);
  }

}