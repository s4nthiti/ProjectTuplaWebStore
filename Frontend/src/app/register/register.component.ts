import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../_alert/alert.service';
import { first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DatePipe]
})

export class RegisterComponent implements OnInit {
  maxDate: any;
  loading = false;
  submitted = false;
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      public service: AuthenticationService,
      private toastr: ToastrService,
      public alertService: AlertService,
      private titleService: Title,
      private datePipe: DatePipe
  ) { 
    this.titleService.setTitle("Sign Up");
    this.maxDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  }

  ngOnInit() {
      this.service.formModel.reset();
  }

  // convenience getter for easy access to form fields
  get f() { return this.service.formModel.controls; }

  onSubmit() {
    this.submitted = true;
    if(!this.service.formModel.valid)
      return;
    this.alertService.clear()
    this.service.register()
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    console.log(error);
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
  }

}