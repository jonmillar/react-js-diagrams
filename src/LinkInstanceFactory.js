import { LinkModel } from './models';
import { AbstractInstanceFactory } from './AbstractInstanceFactory';

export class LinkInstanceFactory extends AbstractInstanceFactory {
  constructor() {
    super('LinkModel');
  }
  
  getInstance() {
    return new LinkModel();
  }
}
