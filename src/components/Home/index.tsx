/**
 * @file 首页
 * @author Deland
 */
import {FC} from 'react';
// import {Button} from 'antd';
import {Link} from 'react-router-dom';
import {URL_PREFIX} from '@/constants';
import styles from './index.less';


const Home: FC = () => {

    return (
        <div className={styles.root}>
            <Link to={`${URL_PREFIX}/jira-generator`}>
                Jira Generator
            </Link>
        </div>
    );
};

export default Home;
