import { ActionTypes, Actions } from '../actions/stop-monitoring.actions';

export interface State { };

export const initialState: State = {};

export function reducer(state = initialState, action: Actions): State {

    switch (action.type) {

        case ActionTypes.LOAD_SUCCESS: {
            const array = [];
            array[action.name] = action.payload;
            return Object.assign({}, state, array);
        }

        case ActionTypes.LOAD_FAILURE: {
            const result = Object.assign({}, state)
            delete  result[action.name];
            return result;
        }

        default: {
            return Object.assign({}, state);
        }
    }
}

export const response = (name: string) => (state: State) => state[name];
