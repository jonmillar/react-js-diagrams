/* @flow */

// libs
import _ from 'lodash';

// src
import * as RJD from '../../../../../src/main';

export class InputNodeModel extends RJD.NodeModel {
  name: string;
  color: string;

  constructor(name:string = 'Untitled', color:string = 'rgb(192, 255, 0)') {
    super('input');
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
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
    return _.filter(this.ports, portModel => !portModel.out);
  }
}
