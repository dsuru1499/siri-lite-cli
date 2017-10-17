import { Action } from '@ngrx/store';

export const ActionTypes = {
    LOAD: 'TRIP_UPDATE',
    LOAD_SUCCESS: 'TRIP_UPDATE_SUCCESS',
    LOAD_FAILURE: 'TRIP_UPDATE_FAILURE'
};

export class LoadAction implements Action {

    public static STOP_ID = "stop_id";
    public static ROUTE_ID = "route_id";

    type = ActionTypes.LOAD;

    constructor(public name: string, public payload: any) { }
}

export class LoadSuccessAction implements Action {

    type = ActionTypes.LOAD_SUCCESS;

    constructor(public name: string, public payload: any) { }
}

export class LoadFailureAction implements Action {

    type = ActionTypes.LOAD_FAILURE;

    constructor(public name: string, public payload?: any) { }
}

export type Actions = LoadAction | LoadSuccessAction | LoadFailureAction;
