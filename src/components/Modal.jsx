// src/components/Modal.jsx
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';

import { setIsModalDragging, useDispatch, StoreContext } from 'Store/Store';
import withSelector from 'Components/withSelector';
import { TRIGGER_ID, MODAL_ID } from 'Constants/element-ids';

const Panel = styled.div`
  cursor: move;
  font-size: 16px;
  transform: translate(${({ left, top }) => `${left}px, ${top}px`});
  top: 0;
  left: 0;
  line-height: 1.5;
  position: absolute;
  opacity: ${({ active }) => (active ? 1 : 0)};
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
  z-index: 1000;
  background-color: hsl(0, 0%, 75%);
  margin: 0 !important;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 4px;
  box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.6);
  transition: opacity 0.15s ease-in-out;
`;

const ModalHeader = styled.h3`
  background-color: hsl(0, 0%, 25%);
  border-radius: 4px;
  color: hsl(0, 0%, 75%);
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: 1.25em;
  line-height: 1.2;
  margin: 0 0 0.8em;
  pointer-events: none;
  text-align: center;
  user-select: none;
`;

const usePanelHooks = () => {
  const dispatch = useDispatch();
  const [panelLeft, setPanelLeft] = useState(null);
  const [panelTop, setPanelTop] = useState(null);
  const [panelInteractionCoordinates, setPanelInteractionCoordinates] =
    useState();
  // set the starting position for the panel and store a reference to the element
  const panelRefCallback = useCallback((panel) => {
    const triggerElement = document.getElementById(TRIGGER_ID);

    if (panel !== null && triggerElement !== null) {
      const triggerRect = triggerElement.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      setPanelLeft(triggerRect.x);
      setPanelTop(triggerRect.y - panelRect.height);
    }
  }, []);

  const pointerDown = ({ clientX: x, clientY: y, pointerId, target }) => {
    const modalElement = document.getElementById(MODAL_ID);

    if (target === modalElement) {
      setPanelInteractionCoordinates({ x, y });
      modalElement.setPointerCapture(pointerId);
      dispatch(setIsModalDragging(true));
    }
  };

  const pointerMove = ({ clientX: x, clientY: y }) => {
    if (panelInteractionCoordinates) {
      const leftDiff = x - panelInteractionCoordinates.x;
      const topDiff = y - panelInteractionCoordinates.y;
      setPanelInteractionCoordinates({ x, y });
      setPanelLeft((panelLeft) => panelLeft + leftDiff);
      setPanelTop((panelTop) => panelTop + topDiff);
    }
  };

  const pointerUp = ({ pointerId }) => {
    const modalElement = document.getElementById(MODAL_ID);

    setPanelInteractionCoordinates(null);
    modalElement.releasePointerCapture(pointerId);
    dispatch(setIsModalDragging(false));
  };

  return {
    panelLeft,
    panelTop,
    panelRefCallback,
    pointerDown,
    pointerMove,
    pointerUp,
  };
};

const selector = ({ isActive }) => ({
  isActive,
});

// @TODO: make this into a class component, move the hooks/handlers into class properties
const Modal = ({ children, container, isActive, title, titleFontFamily }) => {
  const {
    panelLeft,
    panelTop,
    panelRefCallback,
    pointerDown,
    pointerMove,
    pointerUp,
  } = usePanelHooks();

  return createPortal(
    <Panel
      active={isActive}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onPointerMove={pointerMove}
      left={panelLeft}
      top={panelTop}
      ref={panelRefCallback}
      id={MODAL_ID}
    >
      <ModalHeader fontFamily={titleFontFamily}>{title}</ModalHeader>
      {children}
    </Panel>,
    container
  );
};

Modal.defaultProps = {
  children: [],
  container: document.body,
  title: 'Modal Dialog',
  titleFontFamily: 'sans-serif',
};

Modal.propTypes = {
  children: PropTypes.node,
  container: PropTypes.object,
  title: PropTypes.string,
  titleFontFamily: PropTypes.string,
};

export default withSelector(StoreContext, selector)(Modal);
