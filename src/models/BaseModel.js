/* @flow */

import { BaseEntity } from '../BaseEntity';

export class BaseModel extends BaseEntity {
  selected: boolean;

  constructor() {
    super();
    this.selected = false;
  }

  // $FlowFixMe
  deSerialize(ob:{id: string, selected: boolean}):void {
    super.deSerialize(ob);
    this.selected = ob.selected;
  }

  serialize() {
    // $FlowFixMe
    return {
      ...super.serialize(),
      _class: this.constructor.name,
      selected: this.selected
    };
  }

  getID() {
    return this.id;
  }

  isSelected() {
    return this.selected;
  }

  setSelected(selected:boolean):void {
    this.selected = selected;
    this.itterateListeners(listener => {
      if (listener.selectionChanged) {
        listener.selectionChanged(this, selected);
      }
    });
  }

  remove() {
    this.itterateListeners(listener => {
      if (listener.entityRemoved) {
        listener.entityRemoved(this);
      }
    });
  }
}
