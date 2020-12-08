import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../_models/Profile';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  loading = false;
  private isLoggedin!: boolean;
  toggle = false;
  userProfileIMG: any;
  userDetails: any;
  
  constructor(public authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit() {
    }

    onLogout() {
      this.authService.userToken = null;
      this.authService.logout();
    }

    isLoggedIn() {
      return this.authService.loggedIn();
    }

    toggleNav() {
      if(!this.toggle)
      {
        this.toggle = true;
        document.getElementById("mySidenav")!.style.width = "30%";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
      }
      else
      {
        this.toggle = false;
        document.getElementById("mySidenav")!.style.width = "0";
        document.body.style.backgroundColor = "rgba(0,0,0,0)";
      }
    }

    closeNav() {
      this.toggle = false;
        document.getElementById("mySidenav")!.style.width = "0";
        document.body.style.backgroundColor = "rgba(0,0,0,0)";
    }
}
