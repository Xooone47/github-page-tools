import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {RecoilRoot} from 'recoil';
import {store} from '@/store';
import JiraGenerator from '@/components/Home/JiraGenerator';
import {Home} from '..';
import styles from './styles.less';

const App = () => (
    <RecoilRoot>
        <Provider store={store}>
            <BrowserRouter>
                <div className={styles.root}>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/jira-generator" exact component={JiraGenerator} />
                        <Redirect from="*" to="/" />
                    </Switch>
                </div>
            </BrowserRouter>
        </Provider>
    </RecoilRoot>
);

export default App;
