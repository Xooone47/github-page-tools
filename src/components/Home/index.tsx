/**
 * @file 首页
 * @author Deland
 */
import {FC, useEffect, useCallback, useState} from 'react';
import {Button} from 'antd';
import {useCurrentUser, useActions} from '@/hooks';
import {fetchUserInfo} from '@/actions';
import {apiGetTest} from '@/apis';
import ConcurrentDemo from './ConcurrentDemo';
import RecoilDemo from './RecoilDemo';
import styles from './index.less';

const request = [fetchUserInfo];

const Counter: FC = () => {
    const [count, setCount] = useState<number>(0);

    const handleAdd = useCallback(
        () => {
            setCount(count => count + 1);
        },
        []
    );

    const handleSubtract = useCallback(
        () => {
            setCount(count => count - 1);
        },
        []
    );

    return (
        <div className={styles.counter}>
            <div>Count: {count}</div>
            <Button onClick={handleAdd}>+</Button>
            <Button onClick={handleSubtract}>-</Button>
        </div>
    );
};


const Home: FC = () => {
    const user = useCurrentUser();
    const [fetchUser] = useActions(request);

    useEffect(
        () => {
            fetchUser();
        },
        [fetchUser]
    );

    return (
        <div className={styles.root}>
            <h1>FExpy</h1>
            <div>Hi {user?.username}</div>
            <Counter />
            <RecoilDemo />
            <ConcurrentDemo />
        </div>
    );
};

export default Home;
