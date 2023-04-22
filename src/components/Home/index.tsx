/**
 * @file 首页
 * @author Deland
 */
import {FC} from 'react';
import {Link} from 'react-router-dom';
import styles from './index.less';


const Home: FC = () => {

    return (
        <div className={styles.root}>
            <Link to={'/jira-generator'}>
                Jira Generator
            </Link>
            <Link to={'/coffee-snapshot'}>
                Coffee Snapshot
            </Link>
        </div>
    );
};

export default Home;
