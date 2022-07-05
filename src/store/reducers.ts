/**
 * @file 系统reducers
 */
import {combineReducers} from 'redux';
import {RECEIVE_USER_INFO} from '@/actions/types';
import {Action} from '@/types';

const context = (state = {}, action: Action) => {
    const {type, payload} = action;

    switch (type) {
        case RECEIVE_USER_INFO:
            return {
                ...state,
                currentUser: payload,
            };
        default:
            return state;
    }

};

const reducers = combineReducers({
    context,
});

export default reducers;
