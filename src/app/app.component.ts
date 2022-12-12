import { Component, OnInit } from '@angular/core';
import { StationService } from "./service/station.service";
import { Station } from "./domain/model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  station?: Station;
  notification?: string;
  notificationTimeout?: any;

  constructor(private service: StationService) {}

  ngOnInit(): void {
    this.service.stationAdd$.subscribe(s => {
      this.notification = `New station added: ${ s.id } at ${ new Date().toUTCString() }`;
      this.station = s;

      if (this.notificationTimeout)
        clearTimeout(this.notificationTimeout);

      this.notificationTimeout = setTimeout(() => {
        this.notification = undefined;
        this.station = s;
      }, 6000);
    });
  }

  openDetails() {
    if (this.station) {
      this.service.loadDetails(this.station);
    }
  }

}
