import React from 'react';
import { NavLink } from 'react-router-dom';
import SignInForm from './SignInForm';

const Authorization = () => {

  return (
    <div className="container center-inside">
      <div className="center-hor mb-5">
        <h2>
          <i>
            Медицинский Сервис
          </i>
        </h2>
      </div>

      <SignInForm />
    </div>
  )
}

export default Authorization