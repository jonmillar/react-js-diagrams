import { BaseModel } from './BaseModel';
import _ from 'lodash';

export class PointModel extends BaseModel {
  constructor(link, points) {
    super();
    this.x = points.x;
    this.y = points.y;
    this.link = link;
  }

  deSerialize(ob) {
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

  updateLocation(points) {
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