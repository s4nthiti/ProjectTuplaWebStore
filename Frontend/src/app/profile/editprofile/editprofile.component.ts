import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/_alert/alert.service';
import { Profile } from 'src/app/_models/Profile';
import { User } from 'src/app/_models/User';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  formUsername: string;
  formFirstname: string;
  formLastname: string;
  formEmail: any;
  formBirthdate: any;
  formPhoneNumber: string;
  formProfileImage: any;
  existingProfile!: Profile;
  userProfileImg: null;
  userProfileImgUpload!: File;
  userProfilePreview: string = 'assets/images/user-demo.jpg';
  maxDate: any;
  submitted = false;

  form = this.formBuilder.group(
    {
      username: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      birthdate: ['', [Validators.required]],
      phonenumber: ['', [Validators.required, Validators.minLength(10)]]
    }
  );

  user!: User;
  constructor(private toastr: ToastrService, private userservice: AuthenticationService, private formBuilder: FormBuilder, private avRoute: ActivatedRoute, private router: Router, private datePipe: DatePipe, public alertService: AlertService) {
    this.maxDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
    this.formUsername = 'username';
    this.formFirstname = 'firstname';
    this.formLastname = 'lastname';
    this.formEmail = 'email';
    this.formBirthdate = 'birthdate';
    this.formPhoneNumber = 'phonenumber';
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.userservice.getUserProfile().subscribe((user: User) => {
      this.user = user;
      this.form.controls[this.formUsername].setValue(this.user.username);
      this.form.controls[this.formFirstname].setValue(this.user.firstName);
      this.form.controls[this.formLastname].setValue(this.user.lastName);
      this.form.controls[this.formEmail].setValue(this.user.email);
      this.form.controls[this.formBirthdate].setValue(this.datePipe.transform(this.user.birthdate, 'YYYY-MM-dd'));
      this.form.controls[this.formPhoneNumber].setValue(this.user.phoneNumber);
      if(this.user.userIMG)
        this.userProfileImg = this.user.userIMG;
    }, error => {
      console.log('Failed to load user');
    }
    );
  }

  save() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }
    let profile = {
      username: this.form.get(this.formUsername)!.value,
      firstName: this.form.get(this.formFirstname)!.value,
      lastName: this.form.get(this.formLastname)!.value,
      email: this.form.get(this.formEmail)!.value,
      birthdate: this.form.get(this.formBirthdate)!.value,
      phoneNumber: this.form.get(this.formPhoneNumber)!.value,
    };
    const data: FormData = new FormData();
    data.append('userName', profile.username);
    data.append('email', profile.email);
    data.append('firstName', profile.firstName);
    data.append('lastName', profile.lastName);
    data.append('birthdate', profile.birthdate);
    data.append('phoneNumber', profile.phoneNumber);
    data.append('Image', this.userProfileImgUpload)
    const ans = confirm('do you want to save changes?')
    if (ans) {
      this.userservice.updateProfile(data).subscribe(() => {
        this.userservice.getUserProfile().subscribe((user: User) => {
          this.userservice.currentUser.username = user.username;
          this.userservice.currentUser.firstName = user.firstName;
          this.userservice.currentUser.lastName = user.lastName;
          this.userservice.currentUser.email = user.email;
          this.userservice.currentUser.birthdate = user.birthdate;
          this.userservice.currentUser.phoneNumber = user.phoneNumber;
          this.userservice.currentUser.userIMG = user.userIMG;
          localStorage.setItem('user', JSON.stringify(this.userservice.currentUser));
        });
        window.location.reload();
      })
    }
    else
    {
      this.userProfileImg = null;
      //this.userProfileImgUpload = null;
      window.location.reload();
    }
  }
  handlerProfileImgInput(fileIn: Event) {
    const target= fileIn.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.userProfileImgUpload = file;
    if(this.userProfileImgUpload)
    {
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      console.log(ext);
      if (['jpg', 'jpeg', 'png'].indexOf(ext) >= 0)
      {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.userProfileImg = event.target.result;
        }
        reader.readAsDataURL(this.userProfileImgUpload);
      }
      else
      {
        this.alertService.error("Please check your image format (.jpg .jpeg .png)", { autoClose: true });
      }
    }
  }

  get f() { return this.form.controls; }

  get username() { return this.form.get(this.formUsername); }
  get firstname() { return this.form.get(this.formFirstname); }
  get lastname() { return this.form.get(this.formLastname); }
  get email() { return this.form.get(this.formEmail); }
  get birthdate() { return this.form.get(this.formBirthdate); }
  get phonenumber() { return this.form.get(this.formPhoneNumber); }
}