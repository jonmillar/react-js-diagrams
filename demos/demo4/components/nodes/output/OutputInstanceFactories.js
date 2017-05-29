// src
import { AbstractInstanceFactory } from '../../../../../src/AbstractInstanceFactory';
import { OutputNodeModel } from './OutputNodeModel';

export class OutputNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super('OutputNodeModel');
  }

  getInstance() {
    return new OutputNodeModel();
  }
}
