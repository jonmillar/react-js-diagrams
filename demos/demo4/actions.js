/* @flow */
import type { NodeModel, DiagramModel } from '../../src/main'

export const onNodeSelected = (node:NodeModel) => ({ type: 'node-selected', node });
export const updateModel = (model:DiagramModel, props:{} = {}) => ({ type: 'update-model', model, props });
export const undo = () => ({ type: 'undo' });
export const redo = () => ({ type: 'redo' });
