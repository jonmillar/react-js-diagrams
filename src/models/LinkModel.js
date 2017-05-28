/* @flow */

// src
import { BaseModel } from './BaseModel';
import { PointModel } from './PointModel';
import type { PortModel } from './PortModel';

export class LinkModel extends BaseModel {
  linkType: string;
  points: Array<PointModel>;
  extras: {};
  sourcePort: PortModel|null;
  targetPort: PortModel|null;

  constructor(linkType:string = 'default') {
    super();
    this.linkType = linkType;
    this.points = this.getDefaultPoints();
    this.extras = {};
    this.sourcePort = null;
    this.targetPort = null;
  }

  // $FlowFixMe
  deSerialize(ob:{id: string, type: string, points: Array<PointModel>}) {
    super.deSerialize(ob);
    this.linkType = ob.type;
    this.points = ob.points.map(point => {
      var p = new PointModel(this, { x: point.x, y:point.y });
      p.deSerialize(point);
      return p;
    });
  }

  serialize() {
    // $FlowFixMe
    return {
      ...super.serialize(),
      type: this.linkType,
      // $FlowFixMe
      source: this.sourcePort ? this.sourcePort.getParent().id : null,
      sourcePort: this.sourcePort ? this.sourcePort.id : null,
      target: this.targetPort ? this.targetPort.getParent().id : null,
      targetPort: this.targetPort ? this.targetPort.id : null,
      points: this.points.map(point => point.serialize()),
      extras: this.extras
    };
  }

  remove() {
    super.remove();
    if (this.sourcePort) {
      this.sourcePort.removeLink(this);
    }
    if (this.targetPort) {
      this.targetPort.removeLink(this);
    }
  }

  isLastPoint(point:PointModel) {
    return this.getPointIndex(point) === this.points.length - 1;
  }

  getDefaultPoints() {
    return [
      new PointModel(this,{ x: 0, y: 0 }),
      new PointModel(this,{ x: 0, y: 0 }),
    ];
  }

  getPointIndex(point:PointModel) {
    return this.points.indexOf(point);
  }

  getPointModel(id:number) {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].id === id) {
        return this.points[i];
      }
    }
    return null;
  }

  getFirstPoint() {
    return this.points[0];
  }

  getLastPoint() {
    return this.points[this.points.length - 1];
  }

  setSourcePort(port:PortModel) {
    port.addLink(this);
    this.sourcePort = port;
  }

  getSourcePort() {
    return this.sourcePort;
  }

  getTargetPort() {
    return this.targetPort;
  }

  setTargetPort(port:PortModel) {
    port.addLink(this);
    this.targetPort = port;
  }

  getPoints() {
    return this.points;
  }

  setPoints(points:Array<PointModel>) {
    this.points = points;
  }

  removePoint(pointModel:PointModel) {
    this.points.splice(this.getPointIndex(pointModel), 1);
  }

  addPoint(pointModel:PointModel, index:number = 1) {
    this.points.splice(index, 0, pointModel);
  }

  getType() {
    return this.linkType;
  }
}
