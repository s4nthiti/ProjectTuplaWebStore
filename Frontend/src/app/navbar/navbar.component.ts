import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../_alert/alert.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  loading = false;
  private isLoggedin!: boolean;
  
  constructor(public service: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute) { }

  onLogout() {
    this.service.logout();
  }

  isLoggedIn() {
    if (localStorage.getItem('token') == null)
    {
      this.isLoggedin = false;
      return this.isLoggedin;
    }
    else {
      return true;
    }
  }

}
