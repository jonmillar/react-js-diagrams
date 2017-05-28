/* @flow */

// src
import { BaseAction } from './BaseAction';
import type { DiagramModel } from '../../models/DiagramModel';

export class SelectingAction extends BaseAction {
  mouseX2: number;
  mouseY2: number;

  constructor(mouseX:number, mouseY:number) {
    super(mouseX, mouseY);
    this.mouseX2 = mouseX;
    this.mouseY2 = mouseY;
  }

  containsElement(x:number, y:number, diagramModel:DiagramModel) {
    const { mouseX, mouseX2, mouseY, mouseY2 } = this;
    const z = diagramModel.getZoomLevel() / 100;
    const elX = (x + diagramModel.getOffsetX()) * z;
    const elY = (y + diagramModel.getOffsetY()) * z;

    return (
      ((mouseX2 < mouseX) ? elX < mouseX : elX > mouseX) &&
      ((mouseX2 < mouseX) ? elX > mouseX2 : elX < mouseX2) &&
      ((mouseY2 < mouseY) ? elY < mouseY : elY > mouseY) &&
      ((mouseY2 < mouseY) ? elY > mouseY2 : elY < mouseY2)
    );
  }
}
