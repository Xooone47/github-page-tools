/**
 * @file store操作相关hook
 */
import {bindActionCreators} from 'redux';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useMemo} from 'react';

// see https://react-redux.js.org/api/hooks#recipe-useactions
export const useActions = (actions: any) => {
    const dispatch = useDispatch();
    return useMemo(
        () => {
            if (Array.isArray(actions)) {
                return actions.map(a => bindActionCreators(a, dispatch));
            }
            return bindActionCreators(actions, dispatch);
        },
        [dispatch, actions]
    );
};

// see https://react-redux.js.org/api/hooks#recipe-useshallowequalselector
export const useShallowEqualSelector = (selector: any) => {
    return useSelector(selector, shallowEqual);
};
