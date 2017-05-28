/* @flow */

// libs
import _ from 'lodash';

// src
import { BaseModel } from './BaseModel';
import type { PortModel } from './PortModel';

export class NodeModel extends BaseModel {
  nodeType: string;
  ports: {[string]: PortModel};
  extras: {};
  x: number;
  y: number;

  constructor(nodeType:string = 'default') {
    super();
    this.nodeType = nodeType;
    this.x = 0;
    this.y = 0;
    this.extras = {};
    this.ports = {};
  }

  deSerialize(ob:Object) {
    super.deSerialize(ob);
    this.nodeType = ob.type;
    this.x = ob.x;
    this.y = ob.y;
    this.extras = ob.extras;
  }

  serialize() {
    // $FlowFixMe
    return {
      ...super.serialize(),
      type: this.nodeType,
      x: this.x,
      y: this.y,
      extras: this.extras,
      ports: _.map(this.ports, port => port.serialize())
    };
  }

  remove() {
    super.remove();
    for (const key in this.ports) {
      _.forEach(this.ports[key].getLinks(), link => link.remove());
    }
  }

  getPortFromID(id:number) {
    for (const key in this.ports) {
      if (this.ports[key].id === id) {
        return this.ports[key];
      }
    }
    return null;
  }

  getPort(name:string) {
    return this.ports[name];
  }

  getPorts() {
    return this.ports;
  }

  removePort(port:PortModel) {
    // Clear the parent node reference
    if (this.ports[port.name]) {
      this.ports[port.name].setParentNode(null);
      delete this.ports[port.name];
    }
  }

  addPort(port:PortModel) {
    port.setParentNode(this);
    this.ports[port.name] = port;
    return port;
  }

  getType() {
    return this.nodeType;
  }
}
