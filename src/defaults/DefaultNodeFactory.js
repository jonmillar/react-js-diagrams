/* @flow */

// libs
import React from 'react';

// src
import { NodeWidgetFactory } from '../WidgetFactories';
import { DefaultNodeWidget } from './DefaultNodeWidget';
import type { DiagramEngine } from '../DiagramEngine'
import type { DefaultNodeModel } from './DefaultNodeModel'

export class DefaultNodeFactory extends NodeWidgetFactory {
  constructor() {
    super('default');
  }

  generateReactWidget(diagramEngine:DiagramEngine, node:DefaultNodeModel) {
    return (
      <DefaultNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}
