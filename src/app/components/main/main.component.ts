import { Component, OnInit, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {RetrieveCityDataService} from '../../services/retrieve-city-data.service';
import {MapModelUtil} from '../../models/map-model-util';
import * as L from 'leaflet';
import decodePolyline from 'decode-google-map-polyline';
import { MapComponentComponent } from '../map-component/map-component.component';
import { MapMarker } from '../../models/map-marker';
import {PaystationInfo} from '../../models/paystation-info';
import { DOCUMENT } from '@angular/common';
import { RetrieveGoogleDirectionsService } from '../../services/retrieve-google-directions.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  @ViewChild(MapComponentComponent)
  private mapComponent: MapComponentComponent;

  displayedPoints: MapMarker[];
  infoPoints: PaystationInfo[];
  data: any;
  originalconf: boolean;
  myOriginalPos: L.latlng;
  errorCode:string;
  bestGuess:string;
  displayFirstPoints: boolean;
  bestGuessPrefix: string;
  currentPoint: MapMarker;
  centerPoint: L.latlng;
  accessibility: boolean;
  directionPoints: number[][];
  mappedWiper: boolean;

  constructor(private retrieveCityDataService: RetrieveCityDataService, @Inject(DOCUMENT) private document: Document, private retrieveDrivingDirections: RetrieveGoogleDirectionsService) { }

  ngOnInit(): void {
    this.errorCode = "Please enable GPS for this website";
    this.originalconf = false;
    this.accessibility = false;
    //this.displayedPoints = [MapModelUtil.mapMarker([49.891972103521184, -97.15886728936238], "Test"), MapModelUtil.mapMarker([49.898360127936286, -97.14957066881469], "Test 1"), MapModelUtil.mapMarker([49.89177246413212, -97.14244325972815], "test 3")];
    const that = this;
    this.retrieveCityDataService.get_parking_data.subscribe({
      next(x) { that.data = x;    that.getLocation();}//,
      //error(err) { console.error('something wrong occurred: ' + err); },
      //complete() { console.log('done'); }
    });
  }

  ngAfterViewInit(): void{
  }

  toggleAccessibilty(){
    this.accessibility = !this.accessibility;
    this.mappedWiper = !this.mappedWiper;
    this.recalculateCenter(this.centerPoint);
  }

  public drawDirectionLine(inpAr: [L.latlng, boolean]){
    let destinationPayphone = inpAr[0];
    this.retrieveDrivingDirections.isDriving = inpAr[1];
    this.retrieveDrivingDirections.origin = this.centerPoint;
    this.retrieveDrivingDirections.destination = destinationPayphone;
    const that = this;
    this.retrieveDrivingDirections.get_parking_data.subscribe({
       next(x: {routes}) {
        that.directionPoints = [[that.centerPoint.lat, that.centerPoint.lng]];
        console.log(x);
        x.routes[0].legs[0].steps.forEach(element => {
          decodePolyline(element.polyline.points).forEach(innerEl => {
            that.directionPoints.push([innerEl.lat, innerEl.lng]);
          });
        });
        that.directionPoints.push([destinationPayphone.lat, destinationPayphone.lng]);
      }
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      var boundProcessPosition = (this.processPosition).bind(this);
      var boundErorrHandle = (this.handleError).bind(this)
      navigator.geolocation.getCurrentPosition(boundProcessPosition, boundErorrHandle);
    } else {
      this.errorCode = "Geolocation is not supported by this browser.";
    }
  }
  handleError(err){
    this.errorCode = `${err.code} ${err.message}` ;
  }
  processPosition(position) {
    try{
      var max_lat = 49.9227;
      var min_lat = 49.8722;
      var min_long = -97.2081;
      var max_long = -97.0733;
        //x.innerHTML = ""
        if(position.coords.latitude <= max_lat && position.coords.latitude >= min_lat && position.coords.longitude <= max_long && position.coords.longitude >= min_long){
          this.myOriginalPos = L.latLng(position.coords.latitude, position.coords.longitude);
          this.errorCode = "";
          this.displayFirstPoints = true;
        }else{
          this.myOriginalPos = L.latLng(49.8951, -97.1384);
          this.errorCode = "You are too far away from central Winnipeg to be displayed";
          this.displayFirstPoints = false;
        }
        this.recenterMap();
        this.originalconf = true;
    }catch(err){
      this.errorCode = err.message;
    }
        //var marker = L.marker([my_lat, my_long]).addTo(mymap);
        //marker.bindPopup("<h6>Your Location</h6>");
  }
  
  compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
  }

  cancelDirection(){
    this.directionPoints = undefined;
  }

  recenterMap(){
    this.displayedPoints = this.analyzedata(L.latLng(this.myOriginalPos.lat, this.myOriginalPos.lng));
    if(this.displayFirstPoints){
      this.bestGuess = this.infoPoints[0].zone;
      this.bestGuessPrefix = "Nearest Payzone to You:";
      this.currentPoint = MapModelUtil.mapMarker([this.myOriginalPos.lat, this.myOriginalPos.lng], "curent", -1, -1);
      this.displayFirstPoints = false;
    }
    this.mapComponent.centerMap(L.latLng(this.myOriginalPos.lat, this.myOriginalPos.lng), this.displayedPoints);
  }

  recalculateCenter(newCenter: L.latlng) {
    if(this.originalconf){
      this.displayedPoints = this.analyzedata(newCenter);
    }
  }

  toggleScrolling(){
    if(this.document.body.style.position == 'fixed'){
      this.document.body.style.position = '';
    }else{
      this.document.body.style.position = 'fixed';
    }

  }

  analyzedata(pointToAnalyze: L.latlng): MapMarker[]{
    this.centerPoint = L.latLng(pointToAnalyze.lat, pointToAnalyze.lng);
    if(this.data != undefined){
        var topLocations = [];
        for(var i =0; i < this.data.length; i++){
            if(!this.accessibility || this.data[i].accessible_space > 0){
              var distance = Math.sqrt((this.data[i].location.latitude - pointToAnalyze.lat)**2 + (this.data[i].location.longitude - pointToAnalyze.lng)**2);
              if(topLocations[4] == undefined){
                topLocations.push([i, distance]);
              }else{
                var worst = 0;
                topLocations.forEach(element => {
                  if(topLocations[worst][1] < element[1]){
                    worst = topLocations.indexOf(element);
                  }
                });
                if(topLocations[worst][1] > distance){
                  topLocations[worst] = [i,distance];
                }
              }
          }
        }
        topLocations.sort(this.compareSecondColumn);
        let tempInputList = [];
        let tempInfoList =  [];
        topLocations.forEach(element => {
          if(element == topLocations[0]){
            tempInputList.push(MapModelUtil.mapMarker(
              [this.data[topLocations[0][0]].location.latitude, this.data[topLocations[0][0]].location.longitude],
              `${this.data[element[0]].paystation_number}: ${this.data[topLocations[0][0]].street}`, this.data[element[0]].hourly_rate, this.data[element[0]].mobile_pay_zone
            ));
            tempInfoList.push(MapModelUtil.paystationInfo(
              this.data[element[0]].street, this.data[element[0]].paystation_number, this.data[element[0]].mobile_pay_zone,
              this.data[element[0]].hourly_rate, this.data[element[0]].time_limit, this.data[element[0]].payment_time, this.data[element[0]].total_space, [this.data[element[0]].location.latitude, this.data[element[0]].location.longitude]
            ));
          }else{
            tempInputList.push(MapModelUtil.mapMarker(
              [this.data[element[0]].location.latitude, this.data[element[0]].location.longitude],
              `${this.data[element[0]].paystation_number}: ${this.data[element[0]].street}`, this.data[element[0]].hourly_rate, this.data[element[0]].mobile_pay_zone
            ));
            tempInfoList.push(MapModelUtil.paystationInfo(
              this.data[element[0]].street, this.data[element[0]].paystation_number, this.data[element[0]].mobile_pay_zone,
              this.data[element[0]].hourly_rate, this.data[element[0]].time_limit, this.data[element[0]].payment_time, this.data[element[0]].total_space, [this.data[element[0]].location.latitude, this.data[element[0]].location.longitude]
            ));
          }
        });
        this.infoPoints = tempInfoList;
        return tempInputList;
    }
  }

}
