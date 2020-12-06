import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Profile } from 'src/app/_models/Profile';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  form: FormGroup;
  formUsername: string;
  formFirstname: string;
  formLastname: string;
  formEmail: any;
  formPhoneNumber: string;
  formProfileImage: any;
  existingProfile!: Profile;
  userProfileImg: null;
  userProfileImgUpload!: File;
  userProfilePreview: string = 'assets/images/user-demo.png';
  constructor(private toastr: ToastrService, private userservice: AuthenticationService, private formBuilder: FormBuilder, private avRoute: ActivatedRoute, private router: Router) {
    this.formUsername = 'username';
    this.formFirstname = 'firstname';
    this.formLastname = 'lastname';
    this.formEmail = 'email';
    this.formPhoneNumber = 'phonenumber';
    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        email: ['', [Validators.email]],
        phonenumber: ['', [Validators.required, Validators.minLength(10)]]
      }
    )
  }

  ngOnInit(): void {
    this.form.controls[this.formUsername].setValue(this.userservice.decodeToken.Username);
    this.form.controls[this.formFirstname].setValue(this.userservice.decodeToken.Firstname);
    this.form.controls[this.formLastname].setValue(this.userservice.decodeToken.Lastname);
    this.form.controls[this.formEmail].setValue(this.userservice.decodeToken.Email);
    this.form.controls[this.formPhoneNumber].setValue(this.userservice.decodeToken.PhoneNumber);
    this.userProfileImg = this.userservice.decodeToken.UserIMG;
  }

  save(ProfileImg: { value: null; }) {
    if (!this.form.valid) {
      return;
    }
    let profile = {
      userName: this.form.get(this.formUsername)!.value,
      firstName: this.form.get(this.formFirstname)!.value,
      lastName: this.form.get(this.formLastname)!.value,
      email: this.form.get(this.formEmail)!.value,
      phoneNumber: this.form.get(this.formPhoneNumber)!.value,
    };
    const data: FormData = new FormData();
    data.append('userName', profile.userName);
    data.append('email', profile.email);
    data.append('firstName', profile.firstName);
    data.append('lastName', profile.lastName);
    data.append('phoneNumber', profile.phoneNumber);
    data.append('Image', this.userProfileImgUpload)
    const ans = confirm('do you want to save changes?')
    if (ans) {
      this.userservice.updateProfile(data).subscribe(() => {
        ProfileImg.value = null;
        window.location.reload();
      })
    }
    else
    {
      this.userProfileImg = null;
      //this.userProfileImgUpload = null;
      ProfileImg.value = null;
      window.location.reload();
    }
  }
  handlerProfileImgInput(file: FileList) {
    this.userProfileImgUpload = file.item(0)!;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.userProfileImg = event.target.result;
    }
    reader.readAsDataURL(this.userProfileImgUpload);
  }


  get username() { return this.form.get(this.formUsername); }
  get firstname() { return this.form.get(this.formFirstname); }
  get lastname() { return this.form.get(this.formLastname); }
  get email() { return this.form.get(this.formEmail); }
  get phonenumber() { return this.form.get(this.formPhoneNumber); }
}