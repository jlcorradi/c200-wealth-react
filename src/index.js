import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {GlobalStateProvider} from './store/GlobalStateContext';

import 'react-notifications/lib/notifications.css';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
