import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, max } from 'rxjs/operators';
import { AlertService } from '../_alert/alert.service';
import { PublisherService } from '../_services/publisher.service';

@Component({
  selector: 'app-publisher-register',
  templateUrl: './publisher-register.component.html',
  styleUrls: ['./publisher-register.component.scss']
})
export class PublisherRegisterComponent implements OnInit {

  constructor(private publisherService: PublisherService, private formBuilder: FormBuilder, private alertService: AlertService, private route: ActivatedRoute, private router: Router,) { 
    this.formPublisherName = 'publisherName';
    this.formStreetAddress = 'streetAddress';
    this.formCity = 'city';
    this.formState = 'state';
    this.formPostal = 'postal';
    this.formCountry = 'country';
  }

  currentPage: any;
  minTemplate = 1;
  maxTemplate = 3;

  submitted = false;
  loading = false;

  formPublisherName: string;
  formStreetAddress: string;
  formCity: string;
  formState: string;
  formPostal: any;
  formCountry: any;

  imageFault = false;

  userIdentityImg: null;
  userIdentityImgUpload!: File;
  userIdentityPreview: string = 'assets/images/identitycard.png';

  form = this.formBuilder.group(
    {
      publisherName: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postal: ['', [Validators.required]],
      country: ['', [Validators.required]]
    }
  );

  ngOnInit(): void {
    this.currentPage = 1;
  }

  pageCheck(page: any)
  {
    if(page === this.currentPage)
      return true;
    return false;
  }

  nextPage() {
    if(this.currentPage < this.maxTemplate)
      this.currentPage++;
    this.onTop();  
  }

  previousPage() {
    if(this.currentPage > this.minTemplate)
      this.currentPage--;
    this.onTop();
  }

  minPage() {
    if(this.currentPage != this.minTemplate)
      return true;
    return false;
  }

  maxPage() {
    if(this.currentPage != this.maxTemplate)
      return true;
    return false;
  }

  save() {
    this.submitted = true;
    if (!this.form.valid) {
      this.onTop();
      return;
    }
    if(!this.userIdentityImgUpload){
      this.alertService.error('Please upload Identity Card Image', {autoClose: true});
      this.onTop();
      return;
    }
    if (this.imageFault)
    {
      this.alertService.error("Please check your image format (.jpg .jpeg .png)", { autoClose: true });
      return;
    }
    let publisher = {
      publisherName: this.form.value.publisherName,
      streetAddress: this.form.value.streetAddress,
      city: this.form.value.city,
      state: this.form.value.state,
      postal: this.form.value.postal,
      country: this.form.value.country,
    };
    const data: FormData = new FormData();
    data.append('publisherName', publisher.publisherName);
    data.append('streetAddress', publisher.streetAddress);
    data.append('city', publisher.city);
    data.append('state', publisher.state);
    data.append('postal', publisher.postal);
    data.append('country', publisher.country);
    data.append('Image', this.userIdentityImgUpload)
    console.log("form = " + data.getAll('publisherName'));
    const ans = confirm('do you want to save changes?')
    if(ans)
    {
      this.publisherService.registerPublisher(data)
              .pipe(first())
              .subscribe(
                  res => {
                      this.nextPage();
                      this.alertService.success('Registration successful waiting for admin verification', { autoClose: true, keepAfterRouteChange: true });
                  },
                  error => {
                      console.log(error);
                      this.alertService.error(error.error.message);
                      this.loading = false;
                  });
    }
  }

  handlerIdentityImgInput(fileIn: Event) {
    const target= fileIn.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.userIdentityImgUpload = file;
    if(this.userIdentityImgUpload)
    {
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      console.log(ext);
      if (['jpg', 'jpeg', 'png'].indexOf(ext) >= 0)
      {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.userIdentityImg = event.target.result;
        }
        this.imageFault = false;
        reader.readAsDataURL(this.userIdentityImgUpload);
      }
      else
      {
        this.imageFault = true;
        this.alertService.error("Please check your image format (.jpg .jpeg .png)", { autoClose: true });
      }
    }
  }

  get f() { return this.form.controls; }

  get publisherName() { return this.form.get(this.formPublisherName); }
  get streetAddress() { return this.form.get(this.formStreetAddress); }
  get city() { return this.form.get(this.formCity); }
  get state() { return this.form.get(this.formState); }
  get postal() { return this.form.get(this.formPostal); }
  get country() { return this.form.get(this.formCountry); }

  onTop(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

}
