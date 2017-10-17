import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from "rxjs/Rx"

import * as sd from '../actions/stop-points-discovery.actions';
import { StopPointsDiscoveryService } from '../services/stop-points-discovery.service';
import * as model from '../reducers';

@Injectable()
export class StopPointsDiscoveryEffects {

    constructor(private actions$: Actions, private service: StopPointsDiscoveryService) { }

    @Effect() load$: Observable<Action> = this.actions$
        .ofType(sd.ActionTypes.LOAD)
        .debounceTime(300)
         .switchMap((action: sd.LoadAction) => {
            if (action.payload === '') {
                return Observable.empty();
            }

            const next$ = this.actions$.ofType(sd.ActionTypes.LOAD).skip(1);
            return this.service.get(action.payload)
                .takeUntil(next$)
                .map(result => new sd.LoadSuccessAction(result))
                .catch(error => Observable.of(new sd.LoadFailureAction(error)));
        });
}