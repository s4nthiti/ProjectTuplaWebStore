import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PublisherRequestList } from 'src/app/_models/PublisherRequestList';
import { PublisherService } from 'src/app/_services/publisher.service';

@Component({
  selector: 'app-publisher-request',
  templateUrl: './publisher-request.component.html',
  styleUrls: ['./publisher-request.component.scss']
})
export class PublisherRequestComponent implements OnInit {

  RequestList$!: Observable<PublisherRequestList[]>
  constructor( private publisherService: PublisherService ) { }

  ngOnInit(): void {
    this.loadUserList();
  }
  
  loadUserList() {
    this.RequestList$ = this.publisherService.getRequestlist();
  }
}
