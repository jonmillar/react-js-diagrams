/* @flow */

// libs
import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

// src
import { reducer } from './reducer';
import { model } from './savedModel';

const logger = createLogger({
  collapsed: true
});

const preloadedState = {
  present: {
    model,
    selectedNode: null
  }
};

export const store = createStore(
  reducer,
  preloadedState,
  applyMiddleware(logger)
);

window.store = store;
