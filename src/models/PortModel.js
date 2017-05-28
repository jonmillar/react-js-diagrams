/* @flow */

// libs
import _ from 'lodash';

// src
import { BaseModel } from './BaseModel';
import type { NodeModel } from './NodeModel';
import type { LinkModel } from './LinkModel';

export class PortModel extends BaseModel {
  name: string;
  links: {[string]: LinkModel};
  parentNode: NodeModel|null;

  constructor(name:string) {
    super();
    this.name = name;
    this.links = {};
    this.parentNode = null;
  }

  deSerialize(ob:Object) {
    super.deSerialize(ob);
    this.name = ob.name;
  }

  serialize() {
    let parentNodeId = '';

    if ( this.parentNode !== null ) {
      parentNodeId = this.parentNode.id;
    }

    return {
      ...super.serialize(),
      name: this.name,
      parentNode: parentNodeId,
      links: _.map(this.links, link => link.id)
    };
  }

  getName() {
    return this.name;
  }

  getParent() {
    return this.parentNode;
  }

  setParentNode(node:NodeModel|null) {
    this.parentNode = node;
  }

  removeLink(link:LinkModel) {
    delete this.links[link.getID()];
  }

  addLink(link:LinkModel) {
    this.links[link.getID()] = link;
  }

  getLinks() {
    return this.links;
  }
}