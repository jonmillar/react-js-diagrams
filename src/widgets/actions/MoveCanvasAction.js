/* @flow */

// src
import { BaseAction } from './BaseAction';
import type { DiagramModel } from '../../models';

export class MoveCanvasAction extends BaseAction {
  initialOffsetX: number;
  initialOffsetY: number;

  constructor(mouseX:number, mouseY:number, diagramModel:DiagramModel) {
    super(mouseX, mouseY);
    this.initialOffsetX = diagramModel.getOffsetX();
    this.initialOffsetY = diagramModel.getOffsetY();
  }
}
