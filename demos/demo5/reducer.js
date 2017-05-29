/* @flow */

// libs
import undoable, { includeAction } from 'redux-undo';

// src
import { NodeModel, DiagramModel } from '../../src/main';

const getInitialState = () => ({
  selectedNode: null,
  model: null
});

export const reducerFn = (state:any = getInitialState(), action:{type:string, node:?NodeModel, model:?DiagramModel, props:?Object}) => {
  switch (action.type) {
    case 'node-selected':
      return {
        ...state,
        selectedNode: action.node
      };
    case 'update-model':
      return {
        ...state,
        model: action.model,
        ...action.props
      };
    default:
      return state;
  }
};

export const reducer = undoable(reducerFn, {
  filter: includeAction(['update-model'])
});
