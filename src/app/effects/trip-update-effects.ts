import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from "rxjs/Rx"

import * as tu from '../actions/trip-update.actions';
import { TripUpdateService } from '../services/trip-update.service';
import * as model from '../reducers';

@Injectable()
export class TripUpdateEffects {

    constructor(private actions$: Actions, private service: TripUpdateService) { }

    @Effect() load$: Observable<Action> = this.actions$
        .ofType(tu.ActionTypes.LOAD)
        .debounceTime(300)
        .switchMap((action: tu.LoadAction) => {
            if (action.payload === '') {
                return Observable.empty();
            }

            const next$ = this.actions$.ofType(tu.ActionTypes.LOAD).skip(1);
            return this.service.get(action.payload)
                .takeUntil(next$)
                .map(result => new tu.LoadSuccessAction(action.name, result))
                .catch(error => Observable.of(new tu.LoadFailureAction(action.name, error)));
        });
}