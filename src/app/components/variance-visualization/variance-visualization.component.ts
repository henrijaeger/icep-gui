import { Component, OnInit } from '@angular/core';
import {StationService} from "../../service/station.service";

@Component({
  selector: 'app-variance-visualization',
  templateUrl: './variance-visualization.component.html',
  styleUrls: ['./variance-visualization.component.scss']
})
export class VarianceVisualizationComponent implements OnInit {

  constructor(private service: StationService) { }

  ngOnInit(): void {
  }

  get type() {
    const v = this.value;

    if (v < 10) {
      return "success";
    } else if (v < 50) {
      return "warning";
    } else if (v < 80) {
      return "danger";
    }

    return "dark";
  }

  get value() {
    return this.service.variance(this.service.station);
  }

}
