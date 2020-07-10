import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable, of, empty } from 'rxjs';
import { debounceTime, switchMap, skip, map, takeUntil, catchError } from 'rxjs/operators';

import * as sd from '../actions/stop-points-discovery.actions';
import { StopPointsDiscoveryService } from '../services/stop-points-discovery.service';
import * as model from '../reducers';

@Injectable()
export class StopPointsDiscoveryEffects {

    @Effect() load$: Observable<Action> = this.actions$.pipe(
        ofType(sd.ActionTypes.LOAD),
        debounceTime(300),
        switchMap((action: sd.LoadAction) => {
            if (action.payload === '') {
                return empty();
            }
            const next$ = this.actions$.pipe(ofType(sd.ActionTypes.LOAD), skip(1));
            return this.service.get(action.payload).pipe(
                takeUntil(next$),
                map(result => new sd.LoadSuccessAction(result)),
                catchError(error => of(new sd.LoadFailureAction(error)))
            );
        }));

    constructor(private actions$: Actions, private service: StopPointsDiscoveryService) { }
}
