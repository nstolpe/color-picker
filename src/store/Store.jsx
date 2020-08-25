// src/store/Store.js
import React, {
  createContext,
  useReducer,
  useContext,
} from 'react';

const initialState = {
  color: { h: 0, s: 0, v: 0 },
  isActive: false,
  isModalDragging: false,
  modalElement: null,
  triggerElement: null,
};

export const StoreContext = createContext();
export const useStoreContext = () => useContext(StoreContext);

const SET_COLOR = 'SET_COLOR';
const SET_HUE = 'SET_HUE';
const SET_SATURATION = 'SET_SATURATION';
const SET_VALUE = 'SET_VALUE';
const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
const SET_IS_MODAL_DRAGGING = 'SET_IS_MODAL_DRAGGING';
const SET_MODAL_ELEMENT = 'SET_MODAL_ELEMENT';
const SET_TRIGGER_ELEMENT = 'SET_TRIGGER_ELEMENT';

export const setColor = (h, s, v) => ({
  type: SET_COLOR,
  data: { color: { h, s, v } },
});

export const setHue = h => ({
  type: SET_HUE,
  data: { h },
});

export const setSaturation = s => ({
  type: SET_SATURATION,
  data: { s },
});

export const setValue = v => ({
  type: SET_VALUE,
  data: { v },
});

export const setIsActive = isActive => ({
  type: SET_IS_ACTIVE,
  data: { isActive },
});

export const setIsModalDragging = isModalDragging => ({
  type: SET_IS_MODAL_DRAGGING,
  data: { isModalDragging },
});

export const setModalElement = modalElement => ({
  type: SET_MODAL_ELEMENT,
  data: { modalElement },
});

export const setTriggerElement = triggerElement => ({
  type: SET_TRIGGER_ELEMENT,
  data: { triggerElement },
});

const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_COLOR:
      return {
        ...state,
        color: {
          ...(state.color || {}),
          ...Object.entries(data.color || {}).reduce(
            (components, [component, value]) =>
              value != null && !Number.isNaN(value) ? { ...components, [component]: value } : components,
            {}
          ),
        },
      };
    case SET_HUE:
      return {
        ...state,
        color: {
          ...state.color,
          h: data.h,
        },
      };
    case SET_SATURATION:
      return {
        ...state,
        color: {
          ...state.color,
          s: data.s,
        },
      };
    case SET_VALUE:
      return {
        ...state,
        color: {
          ...state.color,
          v: data.v,
        },
      };
    case SET_IS_ACTIVE:
      return {
        ...state,
        isActive: data.isActive,
      };
    case SET_IS_MODAL_DRAGGING:
      return {
        ...state,
        isModalDragging: data.isModalDragging,
      };
    case SET_MODAL_ELEMENT:
      return {
        ...state,
        modalElement: data.modalElement,
      };
    case SET_TRIGGER_ELEMENT:
      return {
        ...state,
        triggerElement: data.triggerElement,
      };
    default:
      console.log(`undefined action: ${action.type}`, action);
      return state;
  }
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  window.state = state;
  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default Store;
