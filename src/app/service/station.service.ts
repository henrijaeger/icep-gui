import { Injectable } from '@angular/core';
import { WsEndpointService } from "./ws-endpoint.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Response, Station, StationUpdate, StationUpdateDto } from "../domain/model";
import { filter, map, take } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  static readonly CHANNEL = "ws";
  static readonly NEW_STATION = "new-station";
  static readonly STATION_LIST = "station-list";
  static readonly STATION_DETAIL = "station-detail";

  stations: Station[] = [];
  station?: Station;

  station$: Subject<Station | undefined> = new BehaviorSubject<Station | undefined>(undefined);
  stations$: Subject<Station[]> = new Subject<Station[]>();
  stationAdd$: Subject<Station> = new Subject<Station>();
  stationUpdate$: Subject<StationUpdate> = new Subject<StationUpdate>();

  /**/
  detailBroker!: Observable<Station>;

  constructor(private ws: WsEndpointService) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.watch<Station[]>(`/${ StationService.CHANNEL }/${ StationService.STATION_LIST }`).subscribe(s => {
      this.stations$.next(s);
      this.stations = s;
    });

    this.watch<Station>(`/${ StationService.CHANNEL }/${ StationService.NEW_STATION }`).subscribe(s => {
      this.stationAdd$.next(s);
      this.stations.push(s);
    });

    this.detailBroker = this.watch<Station>(`/${ StationService.CHANNEL }/${ StationService.STATION_DETAIL }`);
    this.detailBroker.subscribe(s => {
      const ex = this.stations.filter(t => t.id === s.id).pop();

      if (s && s.id) {
        this.stationUpdate$.next({ id: s.id, before: ex, after: s });

        if (this.station && this.station.id === s.id) {
          Object.assign(this.station, s);
        }
      }
    });
  }

  private watch<T>(endpoint: string): Observable<T> {
    const handle = (body: string): T => {
      const response: Response = JSON.parse(body);

      if (response.status === "OK") {
        return response.value as T;
      } else {
        throw response;
      }
    };

    return this.ws.watch(endpoint).pipe(map(s => handle(s.body)));
  }

  fetchStations() {
    this.ws.publish({ destination: "/icep/list" });
  }

  loadDetails(station: Station) {
    this.station = station;
    this.station$.next(station);
  }

  updateDetails(id: string, station: StationUpdateDto): Observable<Station> {
    this.ws.publish({ destination: `/icep/detail/${ id }`, body: JSON.stringify(station) });

    return this.detailBroker.pipe(filter(x => x.id === id), take(1));
  }

  variance(station?: Station): number {
    if (station) {
      const val = station.value || 0;
      const tar = station.target || 0;

      return tar - val;
    } else {
      return 0;
    }
  }

}
