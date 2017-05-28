/* @flow */

// libs
import _ from 'lodash';

// src
import { BaseModel } from './BaseModel';
import { LinkModel } from './LinkModel';

export class PointModel extends BaseModel {
  x: number;
  y:number;
  link: LinkModel;

  constructor(link:LinkModel, points:{|x:number, y:number|}) {
    super();
    this.x = points.x;
    this.y = points.y;
    this.link = link;
  }

  deSerialize(ob:Object) {
    super.deSerialize(ob);
    this.x = ob.x;
    this.y = ob.y;
  }

  serialize() {
    return {
      ...super.serialize(),
      x: this.x,
      y: this.y
    };
  }

  remove() {
    super.remove();

    // Clear references
    if (this.link) {
      this.link.removePoint(this);
    }
  }

  updateLocation(points:{|x: number, y: number|}) {
    this.x = points.x;
    this.y = points.y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getLink() {
    return this.link;
  }
}