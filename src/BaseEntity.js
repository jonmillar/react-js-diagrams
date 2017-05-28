/* @flow */

// src
import { Toolkit } from './Toolkit';

type Listener = {

}

export class BaseEntity {
  id: string;
  listeners: {[string]: Listener}

  constructor() {
    this.listeners = {};
    this.id = Toolkit.UID();
  }

  getID() {
    return this.id;
  }

  clearListeners() {
    this.listeners = {};
  }

  deSerialize(data:{id:string}) {
    this.id = data.id;
  }

  serialize() {
    return {
      id: this.id,
    };
  }

  itterateListeners(cb:Function) {
    for (const key in this.listeners) {
      cb(this.listeners[key]);
    }
  }

  removeListener(listener:string) {
    if (this.listeners[listener]) {
      delete this.listeners[listener];
      return true;
    }
    return false;
  }

  addListener(listener:Listener) {
    const uid = Toolkit.UID();
    this.listeners[uid] = listener;
    return uid;
  }
}
