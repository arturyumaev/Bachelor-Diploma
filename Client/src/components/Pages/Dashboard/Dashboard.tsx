import React, { createContext, useContext, useState } from 'react';
import { Button } from 'antd';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { fetchApi, HTTPMethod } from '../../../api/Api';
import getSession from '../../../utils';
import { GlobalContext } from '../../../App';

const logoutEntity: string = 'logout';

const handleLogout = (globalContext: any) => (
  fetchApi(logoutEntity, HTTPMethod.POST, {})
    .then((response) => response.json())
    .then((json) => {
      alert('Loggout was successfull');
      globalContext.sessionUpdated();
    })
    .catch((err) => {
      alert(err);
    })
)

export default function Dashboard() {
  const globalContext = useContext(GlobalContext);

  return getSession()
    ? (
      <div>
        <Button type="primary" onClick={() => handleLogout(globalContext)}>Logout</Button>
      </div>
    )
    : (
      <Redirect to='/' />
    );
};

