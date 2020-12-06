import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/User';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';

  constructor(private _authService: AuthenticationService, private _jwtHelperService: JwtHelperService) {}
  
  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user')!);

    if (token) {
      this._authService.decodeToken = this._jwtHelperService.decodeToken(token);
    }
  }
}