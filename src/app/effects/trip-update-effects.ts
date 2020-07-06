import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable, of, empty } from 'rxjs';
import { debounceTime, switchMap, skip , map, takeUntil, catchError } from 'rxjs/operators';

import * as tu from '../actions/trip-update.actions';
import { TripUpdateService } from '../services/trip-update.service';
import * as model from '../reducers';

@Injectable()
export class TripUpdateEffects {

    constructor(private actions$: Actions, private service: TripUpdateService) { }

    @Effect() load$: Observable<any> = this.actions$.pipe(
        ofType(tu.ActionTypes.LOAD),
        debounceTime(300),
        switchMap((action: tu.LoadAction) => {
            if (action.payload === '') {
                return empty();
            }

            const next$ = this.actions$.pipe(
                ofType(tu.ActionTypes.LOAD)
                ,skip(1)
            );

            return this.service.get(action.payload).pipe(
                takeUntil(next$),
                map(result => new tu.LoadSuccessAction(action.name, result)),
                catchError(error => of(new tu.LoadFailureAction(action.name, error)))
            );
        }));
}