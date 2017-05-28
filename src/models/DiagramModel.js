/* @flow */

// libs
import _ from 'lodash';

// src
import { LinkModel } from './LinkModel';
import { NodeModel } from './NodeModel';
import { BaseEntity } from '../BaseEntity';
import type { DiagramEngine } from '../DiagramEngine';

export class DiagramModel extends BaseEntity {
  links: {};
  nodes: {};
  offsetX: number;
  offsetY: number;
  zoom: number;
  rendered: boolean;

  constructor() {
    super();
    this.links = {};
    this.nodes = {};
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 100;
    this.rendered = false;
  }

  deSerializeDiagram(object:Object, diagramEngine:DiagramEngine) {
    this.deSerialize(object);
    this.offsetX = object.offsetX;
    this.offsetY = object.offsetY;
    this.zoom = object.zoom;

    // Deserialize nodes
    _.forEach(object.nodes, node => {
      const nodeOb = diagramEngine.getInstanceFactory(node._class).getInstance();
      nodeOb.deSerialize(node);

      // Deserialize ports
      _.forEach(node.ports, port => {
        const portOb = diagramEngine.getInstanceFactory(port._class).getInstance();
        portOb.deSerialize(port);
        nodeOb.addPort(portOb);
      });

      this.addNode(nodeOb);
    });

    // Attach ports
    _.forEach(object.links, link => {
      const linkOb = diagramEngine.getInstanceFactory(link._class).getInstance();
      linkOb.deSerialize(link);

      if (link.target) {
        const node = this.getNode(link.target);

        if ( node ) {
          linkOb.setTargetPort(node.getPortFromID(link.targetPort));
        }
      }

      if (link.source) {
        const node = this.getNode(link.source);

        if ( node ) {
          linkOb.setSourcePort(node.getPortFromID(link.sourcePort));
        }
      }

      this.addLink(linkOb);
    });
  }

  serializeDiagram() {
    return {
      ...this.serialize(),
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      zoom: this.zoom,
      links: _.map(this.links, link => link.serialize()),
      nodes: _.map(this.nodes, link => link.serialize())
    };
  }

  clearSelection(ignore?:BaseEntity|false, supressListener?:boolean) {
    _.forEach(this.getSelectedItems(), element => {
      if (ignore && ignore.getID() === element.getID()) {
        return;
      }
      element.setSelected(false); //TODO dont fire the listener
    });
    if (supressListener) {
      return;
    }
    this.itterateListeners(listener => {
      if (listener.selectionCleared) {
        listener.selectionCleared();
      }
    });
  }

  getSelectedItems() {
    return [
      // Nodes
      ..._.filter(this.nodes, node => node.isSelected()),
      // Points
      ..._.filter(_.flatMap(this.links, node => node.points), port => port.isSelected()),
      // Links
      ..._.filter(this.links, link => link.isSelected())
    ];
  }

  setZoomLevel(zoom:number) {
    this.zoom = zoom;
    this.itterateListeners(listener => {
      if (listener.controlsUpdated) {
        listener.controlsUpdated();
      }
    });
  }

  setOffset(offsetX:number, offsetY:number) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.itterateListeners(listener => {
      if (listener.controlsUpdated) {
        listener.controlsUpdated();
      }
    });
  }

  setOffsetX(offsetX:number) {
    this.offsetX = offsetX;
    this.itterateListeners(listener => {
      if (listener.controlsUpdated) {
        listener.controlsUpdated();
      }
    });
  }

  setOffsetY(offsetY:number) {
    this.offsetX = offsetY;
    this.itterateListeners(listener => {
      if (listener.controlsUpdated) {
        listener.controlsUpdated();
      }
    });
  }

  getOffsetY() {
    return this.offsetY;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getZoomLevel() {
    return this.zoom;
  }

  getNode(node:NodeModel|string) {
    if (node instanceof NodeModel) {
      return node;
    }
    if (!this.nodes[node]) {
      return null;
    }
    return this.nodes[node];
  }

  getLink(link:LinkModel|string) {
    if (link instanceof LinkModel) {
      return link;
    }
    if (!this.links[link]) {
      return null;
    }
    return this.links[link];
  }

  addLink(link:LinkModel):LinkModel {
    link.addListener({
      entityRemoved: () => {
        this.removeLink(link);
      }
    });
    this.links[link.getID()] = link;
    this.itterateListeners(listener => {
      if (listener.linksUpdated) {
        listener.linksUpdated();
      }
    });
    return link;
  }

  addNode(node:NodeModel):NodeModel {
    node.addListener({
      entityRemoved: () => {
        this.removeNode(node);
      }
    });
    this.nodes[node.getID()] = node;
    this.itterateListeners(listener => {
      if (listener.nodesUpdated) {
        listener.nodesUpdated();
      }
    });
    return node;
  }

  removeLink(link:LinkModel):void {
    if (link instanceof LinkModel) {
      delete this.links[link.getID()];
      this.itterateListeners(listener => {
        if (listener.linksUpdated) {
          listener.linksUpdated();
        }
      });
      return;
    }
    delete this.links[_.toString(link)];
    this.itterateListeners(listener => {
      if (listener.linksUpdated) {
        listener.linksUpdated();
      }
    });
  }

  removeNode(node:NodeModel):void {
    if (node instanceof NodeModel) {
      delete this.nodes[node.getID()];
      this.itterateListeners(listener => {
        if (listener.nodesUpdated) {
          listener.nodesUpdated();
        }
      });
      return;
    }

    delete this.nodes[_.toString(node)];
    this.itterateListeners(listener => {
      if (listener.nodesUpdated) {
        listener.nodesUpdated();
      }
    });
  }

  nodeSelected(node:NodeModel|{model:NodeModel, element:HTMLElement}):void {
    this.itterateListeners(listener => {
      if (listener.selectionChanged) {
        listener.selectionChanged(node);
      }
    });
  }

  getLinks() {
    return this.links;
  }

  getNodes() {
    return this.nodes;
  }
}
