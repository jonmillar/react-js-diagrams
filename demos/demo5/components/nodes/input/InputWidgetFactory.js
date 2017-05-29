/* @flow */

import * as RJD from '../../../../../src/main';
import { InputNodeWidgetFactory } from './InputNodeWidget';

export class InputWidgetFactory extends RJD.NodeWidgetFactory{
  constructor() {
    super('input');
  }

  generateReactWidget(diagramEngine:RJD.DiagramEngine, node:RJD.NodeModel) {
    return InputNodeWidgetFactory({ node });
  }
}
