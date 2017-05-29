/* @flow */

import * as RJD from '../../../../../src/main';
import { OutputNodeWidgetFactory } from './OutputNodeWidget';

export class OutputWidgetFactory extends RJD.NodeWidgetFactory{
  constructor() {
    super('output');
  }

  generateReactWidget(diagramEngine:RJD.DiagramEngine, node:RJD.NodeModel) {
    return OutputNodeWidgetFactory({ node });
  }
}
