import { Injectable } from '@angular/core';
import { WsEndpointService } from "./ws-endpoint.service";
import {Observable, Subject} from "rxjs";
import { Station } from "../domain/model";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  static readonly CHANNEL = "ws";
  static readonly NEW_STATION = "new-station";
  static readonly STATION_LIST = "station-list";

  stations: Station[] = [];
  station?: Station;

  stations$: Subject<Station[]> = new Subject<Station[]>();
  stationAdd$: Subject<Station> = new Subject<Station>();

  constructor(private ws: WsEndpointService) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.ws.watch(`/${ StationService.CHANNEL }/${ StationService.STATION_LIST }`).subscribe(msg => {
      const s: Station[] = JSON.parse(msg.body);

      this.stations$.next(s);
      this.stations = s;
    });

    this.ws.watch(`/${ StationService.CHANNEL }/${ StationService.NEW_STATION }`).subscribe(msg => {
      const s: Station = JSON.parse(msg.body);

      this.stationAdd$.next(s);
      this.stations.push(s);
    });
  }

  fetchStations() {
    this.ws.publish({ destination: "/icep/list" });
  }

  loadDetails(station: Station) {
    this.station = station;
  }

  variance(station?: Station): number {
    if (station) {
      const val = station.value || 0;
      const tar = station.target || 0;

      return Math.abs(tar - val);
    } else {
      return 0;
    }
  }

}
