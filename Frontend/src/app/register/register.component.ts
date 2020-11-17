import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      public service: UserService,
      private toastr: ToastrService
  ) { }

  ngOnInit() {
      this.service.formModel.reset();
  }

  // convenience getter for easy access to form fields
  get f() { return this.service.formModel.controls; }

  onSubmit() {
    this.service.register().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
          confirm("New user created!, Registration successful.")
        } else {
          res.errors.forEach((element: { code: any; description: string | undefined; }) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken','Registration failed.');
                confirm("Username is already taken,Registration failed.")
                break;

              default:
              this.toastr.error(element.description,'Registration failed.');
              confirm(element.description+"Registration failed.")
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}