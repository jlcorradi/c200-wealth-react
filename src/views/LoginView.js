import React, { useState } from 'react';
import { http } from '../Http';
import { GlobalActions, useGlobalState } from '../store/GlobalStateContext';
import { Auth } from '../Auth';
import '../Login.css';
import querystring from 'querystring-es3'

function LoginView() {
  const [, globalDispatch] = useGlobalState();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  function submitLogin(e) {
    e.preventDefault();
    http
      .post(
        '/auth',
        querystring.stringify({
          username: login, //gave the values directly for testing
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        Auth.setToken(response.data.access_token);
        globalDispatch(GlobalActions.toggleAuthenticated(true));
      });
  }

  return (
    <form onSubmit={submitLogin}>
      <div className="login-container">
        <div className="flex flex-column loginpane">
          <div className="form-group padding">
            <label htmlFor="login">Login</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="form-group padding">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-row padding justify-content-end">
            <button type="submit">
              <i className="bx bx-lock-open-alt"></i> Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginView;
