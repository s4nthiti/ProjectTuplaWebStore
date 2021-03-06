import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  userDetails: any;
  userProfileImg: any;
  userProfilePreview: string = 'assets/images/user-demo.jpg';
  showModal!: boolean;
  showDeclineModal!: boolean;
  constructor(private router: Router, public service: AuthenticationService)
  {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
        if(res.userIMG)
          this.userProfileImg = res.userIMG;
      },
      err => {
        console.log(err);
      },
    );
  }
  showImgProfile() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
    this.showDeclineModal = false;
  }
}