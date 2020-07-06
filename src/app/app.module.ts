import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { AppComponent } from './app.component';
import { reducer } from './reducers';

import { StopPointsDiscoveryService } from './services/stop-points-discovery.service';
import { TripUpdateService } from './services/trip-update.service';
import { StopMonitoringService } from './services/stop-monitoring.service';

import { StopPointsDiscoveryEffects } from './effects/stop-points-discovery-effects';
import { TripUpdateEffects } from './effects/trip-update-effects';
import { StopMonitoringEffects } from './effects/stop-monitoring-effects';

import { StopPointsDiscoveryComponent } from './containers/stop-points-discovery/stop-points-discovery.component';
import { StopMonitoringComponent } from './components/stop-monitoring/stop-monitoring.component';
import { TripUpdateComponent } from './components/trip-update/trip-update.component';

@NgModule({
  declarations: [
    AppComponent,
    TripUpdateComponent,
    StopPointsDiscoveryComponent,
    StopMonitoringComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([StopPointsDiscoveryEffects, TripUpdateEffects,StopMonitoringEffects ]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],

  entryComponents: [AppComponent, StopPointsDiscoveryComponent, StopMonitoringComponent, TripUpdateComponent],
  providers: [StopPointsDiscoveryService, StopMonitoringService, TripUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
