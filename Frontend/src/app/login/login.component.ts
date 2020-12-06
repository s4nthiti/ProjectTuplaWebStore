import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../_alert/alert.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;

  constructor(public service: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public alertService: AlertService,
    private cookieService: CookieService,
    private titleService: Title
    ) { 
      this.titleService.setTitle("Sign In");
    }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.service.loginModel.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.service.loginModel.invalid) {
          return;
      }

      this.loading = true;
      this.service.login().subscribe(data => {
          this.alertService.success('Login successful', { autoClose: true, keepAfterRouteChange: true });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error => {
          console.log(error);
          this.alertService.error(error.error.message);
          this.loading = false;
      });
    }
  }