/**
 * @file 上下文相关hook
 */
import {useSelector} from 'react-redux';

export const useCurrentUser = () => {
    const currentUser = useSelector((state: any) => state?.context?.currentUser);
    return currentUser;
};
