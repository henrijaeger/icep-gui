import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { stompConfig, WsEndpointService } from "./service/ws-endpoint.service";
import { StationListComponent } from './components/station-list/station-list.component';
import { StationDetailComponent } from './components/station-detail/station-detail.component';
import {NgbAlertModule, NgbDatepickerModule, NgbProgressbarModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import { VarianceVisualizationComponent } from './components/variance-visualization/variance-visualization.component';

export function rxStompServiceFactory() {
  const rxStomp = new WsEndpointService();
  rxStomp.configure(stompConfig);
  rxStomp.activate();
  return rxStomp;
}

@NgModule({
  declarations: [
    AppComponent,
    StationListComponent,
    StationDetailComponent,
    VarianceVisualizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbDatepickerModule,
    FormsModule,
    NgbAlertModule,
    NgbTooltipModule,
    NgbProgressbarModule
  ],
  providers: [
    { provide: WsEndpointService, useFactory: rxStompServiceFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
