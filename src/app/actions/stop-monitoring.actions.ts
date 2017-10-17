import { Action } from '@ngrx/store';

export const ActionTypes = {
    LOAD: 'STOP_MONITORING_UPDATE',
    LOAD_SUCCESS: 'STOP_MONITORING_UPDATE_SUCCESS',
    LOAD_FAILURE: 'STOP_MONITORING_UPDATE_FAILURE'
};

export class LoadAction implements Action {

    public static MONITORING_REF = "MonitoringRef";
    public static MAXIMUM_STOP_VISITS = "MaximumStopVisits";

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
