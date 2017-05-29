/* @flow */

// src
import { AbstractInstanceFactory } from '../../../../../src/AbstractInstanceFactory';
import { ConnectionNodeModel } from './ConnectionNodeModel';

export class ConnectionNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super('ConnectionNodeModel');
  }

  getInstance() {
    return new ConnectionNodeModel();
  }
}
