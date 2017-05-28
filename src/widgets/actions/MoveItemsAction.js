/* @flow */

// src
import { BaseAction } from './BaseAction';
import type { DiagramEngine } from '../../DiagramEngine';
import type { BaseModel } from '../../models/BaseModel';

export class MoveItemsAction extends BaseAction {
  moved: boolean;
  selectionModels: Array<{|model: BaseModel, initialX: number, initialY: number|}>

  constructor(mouseX:number, mouseY:number, diagramEngine:DiagramEngine) {
    super(mouseX, mouseY);
    this.moved = false;
    diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
    this.selectionModels = diagramEngine.getDiagramModel().getSelectedItems().map(item => ({
      model: item,
      initialX: item.x,
      initialY: item.y,
    }));
  }
}
