import {BrowserRouter, Route, Switch, Redirect, HashRouter} from 'react-router-dom';
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
                <Switch>
                    <Route path={URL_PREFIX} exact>
                        <HashRouter>
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/jira-generator" exact component={JiraGenerator} />
                                <Redirect from="*" to="/" />
                            </Switch>
                        </HashRouter>
                    </Route>
                    <Redirect from="*" to={URL_PREFIX} />
                </Switch>

            </BrowserRouter>
        </Provider>
    </RecoilRoot>
);

export default App;
