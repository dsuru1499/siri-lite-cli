import { ActionTypes, Actions } from '../actions/stop-points-discovery.actions';

export interface State {
    response: any;
};

export const initialState: State = {
    response: {}
};

export function reducer(state = initialState, action: Actions): State {

    switch (action.type) {

        case ActionTypes.LOAD_SUCCESS: {
            return Object.assign({}, state, {
                response: action.payload
            });
        }

        case ActionTypes.LOAD_FAILURE: {
            return Object.assign({}, state, {
                response: {},
            });
        }

        default: {
            return Object.assign({}, state);
        }
    }
}

export const response = (state: State) => state.response;
