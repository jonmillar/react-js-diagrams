import { BaseEntity } from '../BaseEntity';

export class BaseModel extends BaseEntity {
  constructor() {
    super();
    this.selected = false;
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.selected = ob.selected;
  }

  serialize() {
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

  setSelected(selected) {
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
