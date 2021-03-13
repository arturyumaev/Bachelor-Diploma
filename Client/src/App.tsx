import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Authorization from './components/Pages/Authorization/Authorization';
import Dashboard from './components/Pages/Dashboard/Dashboard';

export const GlobalContext = React.createContext({setAuthorized: (value: boolean) => {}});

export const App: React.FC<{}> = () => {
  const [authorized, setAuthorized] = useState(false);
  
  return (
    <BrowserRouter>
      <GlobalContext.Provider value={{setAuthorized: (value: boolean) => {setAuthorized(value)}}}>
        <div className="full-height">
          <Switch>
            <Route component={Authorization} path='/' exact />
            <Route component={Dashboard} path='/dashboard' />
          </Switch>

          <Route exact path="/">
            {authorized ? <Redirect to='/dashboard' /> : <Authorization />}
          </Route>
        </div>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
};

