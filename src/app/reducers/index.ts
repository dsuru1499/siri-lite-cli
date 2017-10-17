import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { createSelector } from 'reselect';

import * as StopPointsDiscovery from './stop-points-discovery.reducer';
import * as TripUpdate from './trip-update.reducer';
import * as StopMonitoring from './stop-monitoring.reducer';

export interface State {
  sd: StopPointsDiscovery.State;
  tu: TripUpdate.State;
  sm: StopMonitoring.State;
}

export const reducer = {
  sd: StopPointsDiscovery.reducer,
  tu: TripUpdate.reducer,
  sm: StopMonitoring.reducer
};

export const sd = (state: State) => state.sd;
export const sdResponse = createSelector(sd, StopPointsDiscovery.response);

export const tu = (state: State) => state.tu;
export const tuResponse = (name: string) => createSelector(tu, TripUpdate.response(name));

export const sm = (state: State) => state.sm;
export const smResponse = (name: string) => createSelector(sm, StopMonitoring.response(name));

