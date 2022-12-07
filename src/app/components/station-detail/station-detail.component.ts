import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { StationService } from "../../service/station.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Station } from 'src/app/domain/model';

enum NotificationType {

  SUCCESS = "text-success",
  ERROR = "text-danger"

}

interface Notification {

  message: string;
  type: NotificationType;
  timeoutId?: number;

}

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent implements OnInit {

  notification?: Notification;

  data: FormGroup = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    date: new FormControl({ value: {} as NgbDateStruct, disabled: false }),
    target: new FormControl({ value: 0, disabled: true }),
    value: new FormControl({ value: 0, disabled: false })
  });

  initialData?: Station;

  constructor(private service: StationService) {}

  ngOnInit(): void {
    const load = (s?: Station) => {
      this.initialData = s;
      this.applyData(s);
    };

    this.service.station$.subscribe(s => load(s));
    this.service.stationUpdate$.subscribe(u => load(u.after));
  }

  update() {
    if (this.service.station && this.service.station.id) {
      let date: any = this.data.controls.date.value;
      let value = this.data.controls.value.value || 0;

      if (isNaN(value)) {
        this.notify("Value must be a number.", NotificationType.ERROR, 10000);

        return;
      }

      // leading 0 to create a real ISO date string
      const fixed = (places: number, num: any) => String(num).padStart(places, '0')

      if (date) {
        date = `${ fixed(4, date.year) }-${ fixed(2, date.month )}-${ fixed(2, date.day) }`;
      }

      this.service.updateDetails(this.service.station.id, { date, value }).subscribe(
        s => {
          this.initialData = s;
          this.applyData(s);
          this.notify("Updated successfully!", NotificationType.SUCCESS);
        },
        e => this.notify(e.message, NotificationType.ERROR, 10000));
    }
  }

  abort() {
    this.applyData(this.initialData);
  }

  private applyData(s?: Station) {
    if (s) {
      this.data.controls.id.patchValue(s.id || '');
      this.data.controls.target.patchValue(s.target || 0);
      this.data.controls.value.patchValue(s.value || 0);

      if (s?.date) {
        this.data.controls.date.patchValue({ year: s.date[0], month: s.date[1], day: s.date[2] });
      }

      if (this.notification?.timeoutId) {
        clearTimeout(this.notification.timeoutId);

        this.notification = undefined;
      }
    }
  }

  private notify(message: string, type: NotificationType, stay: number = 4000) {
    if (this.notification && this.notification.timeoutId) {
      clearTimeout(this.notification.timeoutId);
    }

    const timer = setTimeout(() => {
      this.notification = undefined;
    }, stay);

    this.notification = { message, type, timeoutId: timer };
  }

  get variance() {
    const v = (this.data.controls.target.value || 0) - (this.data.controls.value.value || 0);

    return isNaN(v) ? '...' : v;
  }


}
