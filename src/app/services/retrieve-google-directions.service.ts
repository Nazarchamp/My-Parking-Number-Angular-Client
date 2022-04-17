import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { HttpClient  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RetrieveGoogleDirectionsService {

  public origin: L.latlng[];
  public destination: L.latlng[];
  public isDriving: boolean;

  constructor(private http: HttpClient) { }

  public get_parking_data = new Observable(subscriber => {
    this.http.post('https://example.com'/*Link to Direction Backend*/, {"origin": this.origin, "destination": this.destination, "isDriving": this.isDriving})
  .subscribe(data => {
        subscriber.next(data);
        subscriber.complete();
    });    
  });

 
  
}
