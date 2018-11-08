/* @flow */

// libs
import _ from 'lodash';
import { NodeModel, PointModel, LinkModel } from './Common';
import { BaseEntity } from './BaseEntity';
import { AbstractInstanceFactory } from './AbstractInstanceFactory';

import type { DefaultNodeModel } from './defaults/DefaultNodeModel';

/**
 * Passed as a parameter to the DiagramWidget
 */
export class DiagramEngine extends BaseEntity {
  diagramModel: DiagramModel;
  forceUpdate: Function;
  canvas: HTMLCanvasElement|null;
  linkFactories: {[string]: LinkWidgetFactory};
  nodeFactories: {[string]: NodeWidgetFactory};
  instanceFactories: {[string]: AbstractInstanceFactory};
  paintableWidgets: {[string]: any}|null;
  
  constructor() {
    super();
    this.diagramModel = new DiagramModel();
    this.nodeFactories = {};
    this.linkFactories = {};
    this.instanceFactories = {};
    this.linkInstanceFactory = null;
    this.canvas = null;
    this.paintableWidgets = null;
    this.forceUpdate = () => {};
  }

  clearRepaintEntities():void {
    this.paintableWidgets = null;
  }

  enableRepaintEntities(entities:Array<any>):void {
    this.paintableWidgets = {};
    entities.forEach(entity => {
      // If a node is requested to repaint, add all of its links
      if (entity instanceof NodeModel) {
        _.forEach(entity.getPorts(), port => {
          _.forEach(port.getLinks(), link => {
            if (this.paintableWidgets === null) return;

            this.paintableWidgets[link.getID()] = true;
          });
        });
      }

      if (this.paintableWidgets === null) return;

      if (entity instanceof PointModel) {
        this.paintableWidgets[entity.getLink().getID()] = true;
      }

      this.paintableWidgets[entity.getID()] = true;
    });
  }

  canEntityRepaint(baseModel:BaseModel):boolean {
    // No rules applied, allow repaint
    if (this.paintableWidgets === null) {
      return true;
    }

    return this.paintableWidgets[baseModel.getID()] !== undefined;
  }

  setCanvas(canvas:HTMLCanvasElement|null):void {
    this.canvas = canvas;
  }

  setDiagramModel(model:DiagramModel):void {
    this.diagramModel = model;
  }

  setForceUpdate(forceUpdate:Function):void {
    this.forceUpdate = forceUpdate;
  }

  getDiagramModel():DiagramModel {
    return this.diagramModel;
  }

  getNodeFactories():{[string]: NodeWidgetFactory} {
    return this.nodeFactories;
  }

  getLinkFactories():{[string]: LinkWidgetFactory} {
    return this.linkFactories;
  }

  getInstanceFactory(className:string):AbstractInstanceFactory {
    return this.instanceFactories[className];
  }

  registerInstanceFactory(factory:AbstractInstanceFactory):void {
    this.instanceFactories[factory.getName()] = factory;
    // Check for a link instance factory to be used when creating new links via drag
    if (factory.getInstance() instanceof LinkModel) {
      this.linkInstanceFactory = factory;
    }
  }

  registerNodeFactory(factory:NodeWidgetFactory):void {
    this.nodeFactories[factory.getType()] = factory;
    this.itterateListeners(listener => {
      listener.nodeFactoriesUpdated();
    });
  }

  registerLinkFactory(factory:LinkWidgetFactory):void {
    this.linkFactories[factory.getType()] = factory;
    this.itterateListeners(listener => {
      listener.linkFactoriesUpdated();
    });
  }

  getFactoryForNode(node:NodeModel):NodeWidgetFactory|null {
    if (this.nodeFactories[node.getType()]) {
      return this.nodeFactories[node.getType()];
    }
    console.log(`Cannot find widget factory for node of type: [${node.getType()}]`); // eslint-disable-line
    return null;
  }

  getFactoryForLink(link:LinkModel):LinkWidgetFactory|null {
    if (this.linkFactories[link.getType()]) {
      return this.linkFactories[link.getType()];
    }
    console.log(`Cannot find widget factory for link of type: [${link.getType()}]`); // eslint-disable-line
    return null;
  }

  generateWidgetForLink(link:LinkModel):React$Element<*> {
    const linkFactory = this.getFactoryForLink(link);
    if (!linkFactory) {
      throw `Cannot find link factory for link: ${link.getType()}`;
    }
    return linkFactory.generateReactWidget(this, link);
  }

  generateWidgetForNode(node:DefaultNodeModel):React$Element<*> {
    const nodeFactory = this.getFactoryForNode(node);
    if (!nodeFactory) {
      throw `Cannot find widget factory for node: ${node.getType()}`;
    }
    return nodeFactory.generateReactWidget(this, node);
  }

  getRelativeMousePoint(event:SyntheticMouseEvent) {
    const point = this.getRelativePoint(event.pageX, event.pageY);
    return {
      x: (point.x / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetX(),
      y: (point.y / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetY()
    };
  }


    const canvasRect = this.canvas.getBoundingClientRect();
    return { x: x - canvasRect.left, y: y - canvasRect.top };
  }

  getNodePortElement(port:PortModel):HTMLElement {
    if ( this.canvas === null ) throw `this.canvas must not be null`;

    const selector = this.canvas.querySelector(
      `.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`
    );
    if (selector === null) {
      throw `Cannot find Node Port element with nodeID: [${port.getParent().getID()}] and name: [${port.getName()}]`;
    }
    return selector;
  }

  getPortCenter(port:PortModel):{x:number, y:number} {
    const sourceElement = this.getNodePortElement(port);
    const sourceRect = sourceElement.getBoundingClientRect();
    const scrollOffset = this.getScrollOffset(sourceElement)
    const rel = this.getRelativePoint(sourceRect.left,sourceRect.top);
    const x = (sourceElement.offsetWidth / 2) + rel.x / (this.diagramModel.getZoomLevel() / 100.0) -
      this.diagramModel.getOffsetX() + scrollOffset.x;
    const y = (sourceElement.offsetHeight / 2) + rel.y / (this.diagramModel.getZoomLevel() / 100.0) -
      this.diagramModel.getOffsetY() + scrollOffset.y;

    return {
      x,
      y
    };
  }

  getScrollOffset(sourceElement:HTMLElement):{x:number, y:number} {
    const root = sourceElement.closest('.react-js-diagrams-canvas')

    if ( !root ) {
      return {x: 0, y: 0}
    }

    return {x: root.scrollLeft, y: root.scrollTop}
  }
}
