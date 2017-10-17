import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from "rxjs/Rx"

import * as sm from '../actions/stop-monitoring.actions';
import { StopMonitoringService } from '../services/stop-monitoring.service';
import * as model from '../reducers';

@Injectable()
export class StopMonitoringEffects {

    constructor(private actions$: Actions, private service: StopMonitoringService) { }

    @Effect() load$: Observable<Action> = this.actions$
        .ofType(sm.ActionTypes.LOAD)
        .debounceTime(300)
        .switchMap((action: sm.LoadAction) => {
            if (action.payload === '') {
                return Observable.empty();
            }

            const next$ = this.actions$.ofType(sm.ActionTypes.LOAD).skip(1);
            return this.service.get(action.payload)
                .takeUntil(next$)
                .map(result => new sm.LoadSuccessAction(action.name, result))
                .catch(error => Observable.of(new sm.LoadFailureAction(action.name, error)));
        });
}