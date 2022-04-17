import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import {MapMarker} from '../../models/map-marker';

@Component({
  selector: 'map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit, OnChanges {

  private mymap;

  @Input()
  points:MapMarker[];

  @Input()
  mainPoint: MapMarker;

  @Input()
  directionPointsToDraw: number[][];

  @Input()
  wiper: boolean;

  @Output() centerEvent: EventEmitter<L.latLng> = new EventEmitter<L.latLng>();

  constructor() {}
  
  private redIcon = new L.Icon({
    iconUrl: 'assets/kioskdetailed.png',
    iconSize: [41, 41],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "payStation"
  });
  private redIconred = new L.Icon({
    iconUrl: 'assets/kioskdetailedr.png',
    iconSize: [41, 41],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "payStation"
  });

  private redIconor = new L.Icon({
    iconUrl: 'assets/kioskdetailedor.png',
    iconSize: [41, 41],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "payStation"
  });
  private greenIcon = new L.Icon({
    iconUrl: 'assets/focusdetailed.png',
    iconSize: [41, 41],
    iconAnchor: [20, 20],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private configuremap(){
    this.mymap = L.map('map', {
      center: [49.8951, -97.1384],
      zoom: 13
    });
    this.mymap.setMaxBounds([
      [49.9227, -97.2081],
      [49.8722, -97.0733]
    ]);
  }

  centerBoundFunction: any;
  isDirection: boolean;

  ngOnInit(): void {
    var legend = L.control({position: 'topright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'money legend');
      div.innerHTML += "<img src='assets/Legend.png' width='50px'></img>";
      return div;
    }
    this.isDirection = false;
    if(this.mymap == undefined){
       this.configuremap();
    }
    legend.addTo(this.mymap);
    this.mymap
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom:13,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> Contributors. Tiles courtesy of Humanitarian OpenStreetMap Team contributors'
    }).addTo(this.mymap);

    this.centerBoundFunction = (function() { 
      var shouldStop = false;
      this.mymap.eachLayer((layer) => {if(layer._popup != undefined){if(layer.getPopup().isOpen()){shouldStop = true;}}});
      this.mymap.eachLayer((layer) => {
        if(layer._popup != undefined){
          if(!shouldStop && !this.isDirection){
            if(layer._popup._content != "<h6>Your Location</h6>" ){
              layer.remove();
            }
          }
        }
      }); 
      if(!shouldStop && !this.isDirection){
        this.centerEvent.emit(this.mymap.getCenter());  
        var marker = L.marker(this.mymap.getCenter(), {icon: this.greenIcon}).addTo(this.mymap);
        marker.bindPopup("<h6>Position Used</h6>");
      }        
    }).bind(this);

    this.mymap.on("moveend", this.centerBoundFunction);   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.mymap == undefined){
      this.configuremap();
   }
   if(changes.wiper!=undefined){
     if(changes.wiper.currentValue != undefined){
      this.mymap.eachLayer((layer) => {
        if(layer._popup != undefined){
          if(!this.isDirection){
            if(layer._popup._content != "<h6>Your Location</h6>" ){
              layer.remove();
            }
          }
        }
      }); 
      var marker = L.marker(this.mymap.getCenter(), {icon: this.greenIcon}).addTo(this.mymap);
      marker.bindPopup("<h6>Position Used</h6>");
     }
   }
   if(changes.points != undefined){
    if(changes.points.currentValue != undefined){
      changes.points.currentValue.forEach(point => {
        if(point.rate < 2){
          var marker = L.marker(point.coords, {icon: this.redIcon}).addTo(this.mymap);
        }else if(point.rate > 2.74){
          var marker = L.marker(point.coords, {icon: this.redIconred}).addTo(this.mymap);
        }else{
          var marker = L.marker(point.coords, {icon: this.redIconor}).addTo(this.mymap);
        }
        marker.bindPopup(`<h6>Pay By Phone Zone: <a href="https://m2.paybyphone.com/parking/start/location?locationId=${point.payNumber}">${point.payNumber}</a><br>$${point.rate}/hour</h6>`);
      });
    }
    }
    if(changes.mainPoint != undefined){
      if(changes.mainPoint.currentValue != undefined){
          console.log("creating marker");
          var marker = L.marker(changes.mainPoint.currentValue.coords ).addTo(this.mymap);
          marker.bindPopup(`<h6>Your Location</h6>`);
      }
    }
    if(changes.directionPointsToDraw != undefined){
      this.isDirection = false;
      this.mymap.eachLayer((layer) => {if(layer._path != undefined){layer.remove();}});
      if(changes.directionPointsToDraw.currentValue != undefined && changes.directionPointsToDraw.currentValue != undefined){
        if(changes.directionPointsToDraw.currentValue.length > 0){
          this.isDirection = true;
          L.polyline(changes.directionPointsToDraw.currentValue, {color: 'red', weight:10}).addTo(this.mymap);
        }
      }
    }

  }

  public centerMap(centerPoint:L.latlng, pointsToFit: MapMarker[]){
    var newBounds = L.latLngBounds([
      [centerPoint.lat, centerPoint.lng],
      [centerPoint.lat, centerPoint.lng]
    ]);
    pointsToFit.forEach(element => {
      newBounds.extend([element.coords.lat, element.coords.lng]);
      newBounds.extend([centerPoint.lat*2 - element.coords.lat, centerPoint.lng*2 - element.coords.lng]);
    });

    this.mymap.fitBounds(newBounds);
  }

}
