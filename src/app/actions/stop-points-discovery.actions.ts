import { Action } from '@ngrx/store';

export const ActionTypes = {
    LOAD: 'STOP_POINTS_DISCOVERY',
    LOAD_SUCCESS: 'STOP_POINTS_DISCOVERY_SUCCESS',
    LOAD_FAILURE: 'STOP_POINTS_DISCOVERY_FAILURE'
};


export class LoadAction implements Action {

    public static UPPER_LEFT_LONGITUDE = "BoundingBox.UpperLeft.Longitude";
    public static UPPER_LEFT_LATITUDE = "BoundingBox.UpperLeft.Latitude";
    public static LOWER_RIGHT_LONGITUDE = "BoundingBox.LowerRight.Longitude";
    public static LOWER_RIGHT_LATITUDE = "BoundingBox.LowerRight.Latitude";

    type = ActionTypes.LOAD;

    constructor(public payload: any) { }
}

export class LoadSuccessAction implements Action {

    type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: any) { }
}

export class LoadFailureAction implements Action {

    type = ActionTypes.LOAD_FAILURE;

    constructor(public payload: any) { }
}

export type Actions = LoadAction | LoadSuccessAction | LoadFailureAction;
