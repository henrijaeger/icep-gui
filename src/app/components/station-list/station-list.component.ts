import { Component, OnInit } from '@angular/core';
import { StationService } from "../../service/station.service";
import { Station } from "../../domain/model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  loading = false;

  constructor(private service: StationService) { }

  ngOnInit(): void {
    this.loading = true;

    this.service.fetchStations().subscribe();
    this.service.stations$.subscribe(() => this.loading = false);
  }

  open(station: Station) {
    this.service.loadDetails(station);
  }

  isSelected(station: Station) {
    return this.service.station?.id === station.id;
  }

  get stations(): Station[] {
    return this.service.stations;
  }

}
