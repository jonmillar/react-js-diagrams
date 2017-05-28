import { BaseModel } from './BaseModel';
import _ from 'lodash';

export class PortModel extends BaseModel {
  constructor(name) {
    super();
    this.name = name;
    this.links = {};
    this.parentNode = null;
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.name = ob.name;
  }

  serialize() {
    return {
      ...super.serialize(),
      name: this.name,
      parentNode: this.parentNode.id,
      links: _.map(this.links, link => link.id)
    };
  }

  getName() {
    return this.name;
  }

  getParent() {
    return this.parentNode;
  }

  setParentNode(node) {
    this.parentNode = node;
  }

  removeLink(link) {
    delete this.links[link.getID()];
  }

  addLink(link) {
    this.links[link.getID()] = link;
  }

  getLinks() {
    return this.links;
  }
}