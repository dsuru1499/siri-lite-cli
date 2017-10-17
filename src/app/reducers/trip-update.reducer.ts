import { ActionTypes, Actions } from '../actions/trip-update.actions';

export interface State { };

export const initialState: State = {};

export function reducer(state = initialState, action: Actions): State {

    switch (action.type) {

        case ActionTypes.LOAD_SUCCESS: {
            let array = [];
            array[action.name] = action.payload;
            return Object.assign({}, state, array);
        }

        case ActionTypes.LOAD_FAILURE: {
            delete state[action.name];
            return Object.assign({}, state);
        }

        default: {
            return Object.assign({}, state);
        }
    }
}

export const response = (name: string) => (state: State) => state[name];
