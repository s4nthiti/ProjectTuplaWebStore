import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  loading = false;
  private isLoggedin!: boolean;
  userProfileImg: any;
  
  constructor(public service: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit() {

    }

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
