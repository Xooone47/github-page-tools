/**
 * @file 首页
 * @author Deland
 */
import {FC} from 'react';
import {Link} from 'react-router-dom';
import {Divider, List} from 'antd';
import styles from './index.less';


const Home: FC = () => {
    return (
        <div className={styles.root}>
            <Divider orientation="left">Tools</Divider>
            <List>
                <List.Item><Link to={'/jira-generator'}>Jira Generator</Link></List.Item>
                <List.Item><Link to={'/coffee-snapshot'}>Coffee Snapshot</Link></List.Item>
            </List>
        </div>
    );
};

export default Home;
