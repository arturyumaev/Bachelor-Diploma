import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Authorization from './components/Pages/Authorization/Authorization';
import Dashboard from './components/Pages/Dashboard/Dashboard';
import getSession from './utils';

export const GlobalContext = createContext({
  sessionUpdated: () => {},
})

export const App: React.FC<{}> = () => {
  const [session, setSession] = useState(getSession());
  console.log('session', session);

  console.log('on main');
  
  return (
    <GlobalContext.Provider
      value={{
        sessionUpdated: () => setSession(getSession()),
      }}
    >
      <BrowserRouter>
        <div className="full-height">
          <Switch>
            <Route exact path='/'>
              {session ? <Redirect to='/dashboard' /> : <Authorization />}
            </Route>
            <Route component={Dashboard} path='/dashboard' />
          </Switch>
        </div>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
};

