// src/store/Store.js
import React, { createContext, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import useSelector from 'Hooks/useSelector';
import noop from 'Utility/noop';

const initialState = {
  onColorChange: noop,
  color: { h: 0, s: 0, v: 0 },
  isActive: false,
  isModalDragging: false,
};

export const StoreContext = createContext();
export const useStoreContext = () => useContext(StoreContext);
export const DispatchContext = createContext();
export const useDispatch = () =>
  useSelector(DispatchContext, (dispatch) => dispatch);

const SET_ON_COLOR_CHANGE = 'SET_ON_COLOR_CHANGE';
const SET_COLOR = 'SET_COLOR';
const SET_HUE = 'SET_HUE';
const SET_SATURATION = 'SET_SATURATION';
const SET_VALUE = 'SET_VALUE';
const SET_SATURATION_AND_VALUE = 'SET_SATURATION_AND_VALUE';
const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
const SET_IS_MODAL_DRAGGING = 'SET_IS_MODAL_DRAGGING';

export const setOnColorChange = (onColorChange) => ({
  type: SET_ON_COLOR_CHANGE,
  data: onColorChange,
});

export const setColor = ({ h, s, v }) => ({
  type: SET_COLOR,
  data: { color: { h, s, v } },
});

export const setHue = (h) => ({
  type: SET_HUE,
  data: { h },
});

export const setSaturation = (s) => ({
  type: SET_SATURATION,
  data: { s },
});

export const setSaturationAndValue = ({ s, v }) => ({
  type: SET_SATURATION_AND_VALUE,
  data: { s, v },
});

export const setValue = (v) => ({
  type: SET_VALUE,
  data: { v },
});

export const setIsActive = (isActive) => ({
  type: SET_IS_ACTIVE,
  data: { isActive },
});

export const setIsModalDragging = (isModalDragging) => ({
  type: SET_IS_MODAL_DRAGGING,
  data: { isModalDragging },
});

const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_ON_COLOR_CHANGE:
      return {
        ...state,
        onColorChange: data,
      };
    case SET_COLOR: {
      const { onColorChange } = state;

      return {
        ...state,
        color: data.color,
      };
    }
    case SET_HUE: {
      const color = { ...state.color, h: data.h };
      const { onColorChange } = state;

      return {
        ...state,
        color,
      };
    }
    case SET_SATURATION: {
      const color = { ...state.color, s: data.s };
      const { onColorChange } = state;

      return {
        ...state,
        color,
      };
    }
    case SET_SATURATION_AND_VALUE: {
      const color = { ...state.color, s: data.s, v: data.v };
      const { onColorChange } = state;

      return {
        ...state,
        color,
      };
    }
    case SET_VALUE: {
      const color = { ...state.color, v: data.v };

      return {
        ...state,
        color,
      };
    }
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
    default:
      console.log(`undefined action: ${action.type}`, action);
      return state;
  }
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { color, onColorChange } = state;

  useEffect(() => {
    onColorChange(chroma(color));
  }, [color]);

  // @TODO: DispatchContextProvider is weird, get rid of it.
  return (
    <DispatchContext.Provider value={dispatch}>
      <StoreContext.Provider value={{ ...state, dispatch }}>
        {children}
      </StoreContext.Provider>
    </DispatchContext.Provider>
  );
};

Store.propTypes = {
  children: PropTypes.node,
};

export default Store;
