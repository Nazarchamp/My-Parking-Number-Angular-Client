import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {PaystationInfo} from '../../models/paystation-info';
import * as L from 'leaflet';

@Component({
  selector: 'dropdown-info',
  templateUrl: './dropdown-info.component.html',
  styleUrls: ['./dropdown-info.component.css']
})
export class DropdownInfoComponent implements OnInit, OnChanges{

  @Output() 
  directionEvent: EventEmitter<[L.latLng,boolean]> = new EventEmitter<[L.latLng,boolean]>();

  @Input()
  parkingStations: PaystationInfo[];

  count:number;
  toggleDropDown: Function;

  constructor(private elem: ElementRef) { this.count=0;}

  ngOnInit(): void {
    this.toggleDropDown = function($event) {
      //reference to the button that triggered the function:
      $event.target.classList.toggle("active");
      var content = $event.target.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    };
    
  }

  emitDirection(indexOfPosition: number, isDriving: boolean){
    this.directionEvent.emit([L.latLng(this.parkingStations[indexOfPosition].position[0], this.parkingStations[indexOfPosition].position[1]), isDriving]);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
