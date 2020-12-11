import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Publisher } from '../_models/Publisher';
import { PublisherDetails } from '../_models/PublisherDetails';
import { PublisherRequestList } from '../_models/PublisherRequestList';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  readonly BaseURI = 'http://tupla.sytes.net:25566/';
  readonly PublisherRegisterURL = 'publisher/register';
  readonly PublisherRequestURL = 'publisher';
  readonly VerifyRequestURL = 'publisher/verify/';

  constructor(private http: HttpClient) { }

  registerPublisher(data: any){
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.post(this.BaseURI + this.PublisherRegisterURL, data, { headers: tokenHeader })
  }

  getRequestlist(): Observable<PublisherRequestList[]> {
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get<PublisherRequestList[]>(this.BaseURI + this.PublisherRequestURL, { headers: tokenHeader })
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getRequest(RequestID: any): Observable<PublisherDetails> {
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get<PublisherDetails>(this.BaseURI + this.PublisherRequestURL + '/' + RequestID, { headers: tokenHeader })
    .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  AcceptRequest(RequestID: any) {
    var tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.BaseURI + this.VerifyRequestURL + RequestID, { headers: tokenHeader })
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
