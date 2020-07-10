import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable, of, empty } from 'rxjs';
import { debounceTime, switchMap, skip, map, takeUntil, catchError } from 'rxjs/operators';


import * as sm from '../actions/stop-monitoring.actions';
import { StopMonitoringService } from '../services/stop-monitoring.service';
import * as model from '../reducers';

@Injectable()
export class StopMonitoringEffects {

    @Effect() load$: Observable<Action> = this.actions$.pipe(
        ofType(sm.ActionTypes.LOAD),
        debounceTime(300),
        switchMap((action: sm.LoadAction) => {
            if (action.payload === '') {
                return empty();
            }

            const next$ = this.actions$.pipe(ofType(sm.ActionTypes.LOAD), skip(1));
            return this.service.get(action.payload).pipe(
                takeUntil(next$),
                map(result => new sm.LoadSuccessAction(action.name, result)),
                catchError(error => of(new sm.LoadFailureAction(action.name, error)))
            );
        }));

    constructor(private actions$: Actions, private service: StopMonitoringService) { }
}
