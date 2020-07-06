import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import * as StopMonitoringActions from '../../actions/stop-monitoring.actions';
import * as Gtfs from '../../services/gtfs-realtime';
import { createSelector } from 'reselect';
import { from, timer } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';


@Component({
  selector: 'app-stop-monitoring',
  templateUrl: './stop-monitoring.component.html',
  styleUrls: ['./stop-monitoring.component.css']
})
export class StopMonitoringComponent implements OnInit {

  public static KEY = ' W0RTVV0gMTcvMTAvMTcgQ2l0eXdheSBhc3NvY2lhdGlvbiBkZSBtw6lkaW9jcmVzCg==';  
  
  public model: any = {};
  private responseSubscription: Subscription;
  private timerSubscription: Subscription;
  public counter: number = 0;

  private _response$: Observable<any>;
  public get response$(): Observable<any> { return this._response$; }
  public set response$(value: Observable<any>) {
    this._response$ = value;
  }

  private _name: string;
  public get name(): string { return this._name; }
  public set name(value: string) {
    this._name = value;
    this.initialize();
  }

  constructor(private store: Store<reducers.State>) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.store.dispatch(new StopMonitoringActions.LoadFailureAction(this.name));
    this.responseSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
  }

  protected initialize() {
    this.response$ = this.store.select(
      reducers.smResponse(this.name)).pipe(
        filter(t => t !== undefined),
        map(t => this.update(t)
      ));
    this.responseSubscription = this.response$.subscribe(t => this.model = t);
    this.timerSubscription = timer(0, 10 * 1000).subscribe((t) => this.load());
  }

  private load() {
    this.counter++;
    let url ="";
    if(isDevMode){
      url += "http://127.0.0.1:8080";
    }
    url += "/siri-lite/stop-monitoring"
      + "?" + StopMonitoringActions.LoadAction.MONITORING_REF + '=' + this.name
      + "&" + StopMonitoringActions.LoadAction.MAXIMUM_STOP_VISITS + '=' + 10;
    this.store.dispatch(new StopMonitoringActions.LoadAction(this.name, url));
  }

  private update(message: any) {
    let result = Object.assign({}, { 'id': this.name }, { 'values': [] });
    let values = [];
    if (message.Siri.StopMonitoringDelivery.MonitoredStopVisit) {
     from(message.Siri.StopMonitoringDelivery.MonitoredStopVisit).pipe(take(10))
        .subscribe((value) => result.values.push(value));
    }

    // console.log(result);
    return result;
  }

}
