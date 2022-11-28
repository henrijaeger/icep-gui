import { Component, OnInit } from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Station} from "../../domain/model";
import {StationService} from "../../service/station.service";

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent implements OnInit {

  model: NgbDateStruct = {day: 10, month: 10, year: 2020};

  constructor(private service: StationService) { }

  ngOnInit(): void {
  }

  set id(id: string) {
    if (this.service.station)
      this.service.station.id = id;
  }

  get id(): string {
    return this.service.station?.id || '';
  }

  get target() {
    return this.service.station?.target || '';
  }

  get value() {
    return this.service.station?.value || '';
  }
  get variance() {
    return this.service.variance(this.service.station);
  }


}
