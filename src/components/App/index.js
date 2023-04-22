import {BrowserRouter, Route, Switch, Redirect, HashRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {RecoilRoot} from 'recoil';
import {store} from '@/store';
import JiraGenerator from '@/components/Home/JiraGenerator';
import CoffeeSnapshot from '@/components/CoffeeSnapshot';
import {URL_PREFIX} from '@/constants';
import {Home} from '..';

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
                                <Route path="/coffee-snapshot" exact component={CoffeeSnapshot} />
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
