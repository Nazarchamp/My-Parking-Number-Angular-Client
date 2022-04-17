import * as L from 'leaflet';
import { MapMarker } from './map-marker';
import { PaystationInfo } from './paystation-info';

export class MapModelUtil{
    public static mapMarker(coords: number[], name: string, rate:number, payNum:number): MapMarker {
        let mapMarker = new MapMarker();
        mapMarker.coords = L.latLng(coords);
        mapMarker.name = name;
        mapMarker.rate = rate;
        mapMarker.payNumber = payNum;
        return mapMarker;
    }

    public static paystationInfo(street: string, paystationNumber: string, zone: string, hourlyRate: string, timeLimit:string, paymentTime:string, totalSpace: string, position: number[]): PaystationInfo{
        let paystationInfo = new PaystationInfo();
        paystationInfo.street = street;
        paystationInfo.paystationNumber = paystationNumber;
        paystationInfo.zone = zone;
        paystationInfo.hourlyRate = hourlyRate;
        paystationInfo.timeLimit = timeLimit;
        paystationInfo.paymentTime = paymentTime;
        paystationInfo.totalSpace = totalSpace;
        paystationInfo.position = position;
        return paystationInfo;
    }
}