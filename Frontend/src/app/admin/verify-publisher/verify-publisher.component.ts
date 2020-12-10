import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Publisher } from 'src/app/_models/Publisher';
import { PublisherDetails } from 'src/app/_models/PublisherDetails';
import { PublisherService } from 'src/app/_services/publisher.service';

@Component({
  selector: 'app-verify-publisher',
  templateUrl: './verify-publisher.component.html',
  styleUrls: ['./verify-publisher.component.scss']
})
export class VerifyPublisherComponent implements OnInit {
  
  Publisher$!: Observable<PublisherDetails>;
  RequestId: any;
  showModal!: boolean;
  showDeclineModal!: boolean;
  Img: any;
  
  constructor(private fb: FormBuilder, private publisherService: PublisherService, private avRoute: ActivatedRoute, private router: Router) {
    const RequestidParam = 'RequestID'
    if (this.avRoute.snapshot.params[RequestidParam]) {
      this.RequestId = this.avRoute.snapshot.params[RequestidParam];
    }
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    console.log(this.RequestId)
    this.Publisher$ = this.publisherService.getRequest(this.RequestId);
  }

  Apply() {
    const ans = confirm('Verify this request ?');
    if (ans) {
      this.publisherService.AcceptRequest(this.RequestId).subscribe((res: any) => {
        confirm('Request Accept!');
        this.router.navigate(['../admin/publisher-request']);
      });
    }
  }
  
  showImgIdentity() {
    this.showModal = true; // Show-Hide Modal Check
  }

  hide() {
    this.showModal = false;
    this.showDeclineModal = false;
  }

}