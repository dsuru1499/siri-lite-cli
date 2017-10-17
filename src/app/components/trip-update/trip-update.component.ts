import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import * as TripUpdateActions from '../../actions/trip-update.actions';
import * as Gtfs from "../../services/gtfs-realtime";
import { createSelector } from 'reselect';


@Component({
  selector: 'app-trip-update',
  templateUrl: './trip-update.component.html',
  styleUrls: ['./trip-update.component.css']
})
export class TripUpdateComponent implements OnInit {

  private model: any = {};
  private responseSubscription: Subscription;
  private timerSubscription: Subscription;
  private counter: number = 0;

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
    this.store.dispatch(new TripUpdateActions.LoadFailureAction(this.name));
    this.responseSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
  }

  protected initialize() {
    this.response$ = this.store.select(reducers.tuResponse(this.name)).filter(t => t !== undefined).map(t => this.update(t));
    this.responseSubscription = this.response$.subscribe(t => this.model = t);
    this.timerSubscription = Observable.timer(0, 10 * 1000).subscribe((t) => this.load());
  }

  private load() {
    this.counter++;
    let url = "http://127.0.0.1:8080/gtfs-rt/trip-update"
      + "?" + TripUpdateActions.LoadAction.STOP_ID + '=' + this.name;
    this.store.dispatch(new TripUpdateActions.LoadAction(this.name, url));
  }

  private update(message: Gtfs.transit_realtime.IFeedMessage) {
    let result = Object.assign({}, { 'id': this.name }, { 'values': [] });
    let values = [];
    Observable.from(message.entity).take(10).map(entity => {
      let index = parseInt(entity.id.substring(entity.id.lastIndexOf(":") + 1));
      return Object.assign({}, {
        trip: entity.tripUpdate.trip,
        vehicle: entity.tripUpdate.vehicle,
        stopTimeUpdate: entity.tripUpdate.stopTimeUpdate.find((t) => (t.stopSequence == index)),
        timestamp: entity.tripUpdate.timestamp
      });
    }).subscribe((value) => result.values.push(value));

    //console.log(result);
    return result;
  }

}