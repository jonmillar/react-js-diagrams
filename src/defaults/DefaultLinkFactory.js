/* @flow */

// libs
import React from 'react';

// src
import { LinkWidgetFactory } from '../WidgetFactories';
import { DefaultLinkWidget } from './DefaultLinkWidget';
import type { DiagramEngine } from '../DiagramEngine';
import type { LinkModel } from '../models/LinkModel';

export class DefaultLinkFactory extends LinkWidgetFactory {
  constructor() {
    super('default');
  }

  generateReactWidget(diagramEngine:DiagramEngine, link:LinkModel) {
    return (
      <DefaultLinkWidget link={link} diagramEngine={diagramEngine} />
    );
  }
}
