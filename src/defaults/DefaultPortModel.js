/* @flow */

// src
import { PortModel } from '../models/PortModel';
import { AbstractInstanceFactory } from '../AbstractInstanceFactory';

export class DefaultPortInstanceFactory extends AbstractInstanceFactory {
  constructor() {
    super('DefaultPortModel');
  }

  getInstance() {
    return new DefaultPortModel(true, 'unknown');
  }
}

export class DefaultPortModel extends PortModel {
  in: boolean;
  label:? string|null;

  constructor(isInput:boolean, name:string, label:string|null = null) {
    super(name);
    this.in = isInput;
    this.label = label || name;
  }

  deSerialize(object:{in: boolean, label?: string}) {
    super.deSerialize(object);
    this.in = object.in;
    this.label = object.label;
  }

  serialize() {
    return {
      ...super.serialize(),
      in: this.in,
      label: this.label
    };
  }
}
