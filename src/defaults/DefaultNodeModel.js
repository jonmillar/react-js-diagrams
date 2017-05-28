/* @flow */

// libs
import _ from 'lodash';

// src
import { NodeModel } from '../models/NodeModel';
import { AbstractInstanceFactory } from '../AbstractInstanceFactory';

export class DefaultNodeInstanceFactory extends AbstractInstanceFactory {
  constructor() {
    super('DefaultNodeModel');
  }

  getInstance() {
    return new DefaultNodeModel();
  }
}

export class DefaultNodeModel extends NodeModel {
  name: string;
  color: string;

  constructor(name:string = 'Untitled', color:string = 'rgb(0,192,255)') {
    super('default');
    this.name = name;
    this.color = color;
  }

  deSerialize(object:Object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
    });
  }

  getInPorts() {
    return _.filter(this.ports,(portModel) => portModel.in);
  }

  getOutPorts() {
    return _.filter(this.ports,(portModel) => !portModel.in);
  }
}
