import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {RecoilRoot} from 'recoil';
import {store} from '@/store';
import JiraGenerator from '@/components/Home/JiraGenerator';
import {URL_PREFIX} from '@/constants';
import {Home} from '..';
import styles from './styles.less';

const App = () => (
    <RecoilRoot>
        <Provider store={store}>
            <BrowserRouter>
                <div className={styles.root}>
                    <Switch>
                        <Route path={URL_PREFIX} exact component={Home} />
                        <Route path={`${URL_PREFIX}/jira-generator`} exact component={JiraGenerator} />
                        <Redirect from="*" to={URL_PREFIX} />
                    </Switch>
                </div>
            </BrowserRouter>
        </Provider>
    </RecoilRoot>
);

export default App;
