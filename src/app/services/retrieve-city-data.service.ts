import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RetrieveCityDataService {
  constructor(private http: HttpClient) { }
  public get_parking_data = new Observable(subscriber => {
    this.http.get('https://example.com'/*Link to parking station list backend*/)
    .subscribe(data => {
        subscriber.next(data);
        subscriber.complete();
    });    
  });
}

