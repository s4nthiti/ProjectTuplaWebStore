import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../_models/Profile';
import { Role } from '../_models/role';
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
        document.getElementById("mySidenav")!.style.width = "40%";
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

    isUser() {
      var userRole = localStorage.getItem('role');
      if(userRole)
      {
        if(userRole === Role.User)
          return true;
      }
      return false;
    }

    isAdmin() {
      var userRole = localStorage.getItem('role');
      if(userRole)
      {
        if(userRole === Role.Admin)
          return true;
      }
      return false;
    }
}
