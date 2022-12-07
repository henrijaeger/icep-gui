import { Injectable } from '@angular/core';
import { WsEndpointService } from "./ws-endpoint.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Response, Station, StationUpdate, StationUpdateDto } from "../domain/model";
import { catchError, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  static readonly CHANNEL = "ws";
  static readonly NEW_STATION = "new-station";
  static readonly STATION_UPDATE = "station-update";

  stations: Station[] = [];
  station?: Station;

  station$: Subject<Station | undefined> = new BehaviorSubject<Station | undefined>(undefined);
  stations$: Subject<Station[]> = new Subject<Station[]>();
  stationAdd$: Subject<Station> = new Subject<Station>();
  stationUpdate$: Subject<StationUpdate> = new Subject<StationUpdate>();

  constructor(private ws: WsEndpointService, private http: HttpClient) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.watch<Station>(`/${ StationService.CHANNEL }/${ StationService.NEW_STATION }`).subscribe(s => {
      this.stationAdd$.next(s);
      this.stations.push(s);
    });

    this.watch<Station>(`/${ StationService.CHANNEL }/${ StationService.STATION_UPDATE }`).subscribe(s => {
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

  fetchStations(): Observable<Station[]> {
    return this.http.get<Response>('http://localhost:8080/list').pipe(map(response => {
      if (response.status === "OK") {
        const stations = response.value as Station[];

        this.stations = stations;
        this.stations$.next(stations);

        return stations;
      } else {
        throw response;
      }
    }));
  }

  loadDetails(station: Station) {
    this.station = station;
    this.station$.next(station);
  }

  updateDetails(id: string, station: StationUpdateDto): Observable<Station> {
    return this.http.patch<Response>('http://localhost:8080/detail/' + id, station).pipe(map(response => {
      if (response.status === "OK") {
        return response.value as Station;
      } else {
        throw response;
      }
    }), catchError(e => { throw (e.error) }));
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
