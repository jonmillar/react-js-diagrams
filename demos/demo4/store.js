/* @flow */

// libs
import { createStore, compose, applyMiddleware } from 'redux';
import * as createLogger from 'redux-logger';

// src
import { reducer } from './reducer';

const logger = createLogger({
  level: 'info',
  collapsed: true
});

export const store = applyMiddleware(logger)(compose(createStore))(reducer);
