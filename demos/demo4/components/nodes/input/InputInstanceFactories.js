/* @flow */

// src
import { AbstractInstanceFactory } from '../../../../../src/AbstractInstanceFactory';
import { InputNodeModel } from './InputNodeModel';

export class InputNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super('InputNodeModel');
  }

  getInstance() {
    return new InputNodeModel();
  }
}
