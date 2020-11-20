import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-logout',
  template: '',
  styles: [''],
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.logout();
  }
}
