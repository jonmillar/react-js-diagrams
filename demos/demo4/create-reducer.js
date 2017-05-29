/* @flow */

export default function createReducer (initialState:any, methods:Object) {
  return (state:any = initialState, action:{type:string}) => {
    const reduceFn = methods[action.type];
    if (!reduceFn) {
      return state;
    }
    return { ...state, ...reduceFn(state, action) };
  };
}

export function reducer(initialState:any, handlers:Object) {
  return (state:any = initialState, action:{type:string}) => {
    const reduceFn = handlers[action.type];
    return reduceFn ? reduceFn(state, action) : state;
  };
}
