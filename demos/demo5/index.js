/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { store } from './store';
import { Demo5 } from './demo5';

window.onload = () => {
  const rootEl = document.getElementById('root');
  const render = Component => {
    ReactDOM.render(
      <Provider store={store}>
        <AppContainer>
          <Component />
        </AppContainer>
      </Provider>,
      rootEl
    );
  };

  render(Demo5);

  // $FlowFixMe
  if (module.hot) module.hot.accept('./demo5', () => render(Demo5));
};
