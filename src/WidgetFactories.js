/* @flow */

// src
import React from 'react';

// src
import { DefaultNodeWidget } from './defaults/DefaultNodeWidget';
import { DefaultLinkWidget } from './defaults/DefaultLinkWidget';
import { DiagramEngine } from './DiagramEngine';
import { NodeModel } from './models/NodeModel';
import { LinkModel } from './models/LinkModel';

import type { DefaultNodeModel } from './defaults/DefaultNodeModel';

export class WidgetFactory {
  type:string;

  constructor(name:string) {
    this.type = name;
  }

  getType():string {
    return this.type;
  }
}

export class NodeWidgetFactory extends WidgetFactory {
  generateReactWidget(diagramEngine:DiagramEngine, node:DefaultNodeModel):React$Element<*> {
    return <DefaultNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class LinkWidgetFactory extends WidgetFactory {
  generateReactWidget(diagramEngine:DiagramEngine, link:LinkModel):React$Element<*> {
    return <DefaultLinkWidget link={link} diagramEngine={diagramEngine} />;
  }
}
