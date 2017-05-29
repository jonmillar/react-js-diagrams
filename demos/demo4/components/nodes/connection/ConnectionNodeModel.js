/* @flow */

// libs
import _ from 'lodash';

// src
import * as RJD from '../../../../../src/main';

export class ConnectionNodeModel extends RJD.NodeModel {
  name: string;
  color: string;

  constructor(name:string = 'Untitled', color:string = 'rgb(224, 98, 20)') {
    super('connection');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
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

  getInPort() {
    return this.ports.input;
  }

  getOutPort() {
    return this.ports.output;
  }
}
