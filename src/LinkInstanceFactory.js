/* @flow */

// src
import { LinkModel } from './models/LinkModel';
import { AbstractInstanceFactory } from './AbstractInstanceFactory';

export class LinkInstanceFactory extends AbstractInstanceFactory {
  constructor() {
    super('LinkModel');
  }
  
  getInstance():LinkModel {
    return new LinkModel();
  }
}
