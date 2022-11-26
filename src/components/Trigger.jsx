// src/components/Trigger.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';
import chroma from 'chroma-js';

import { setIsActive, StoreContext } from 'Store/Store';
import withSelector from 'Components/withSelector';
import { TRIGGER_ID, MODAL_ID } from 'Constants/element-ids';

export const Button = styled.button`
  outline: none;
  border: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 0;
  overflow: visible;
  text-transform: none;
  -webkit-appearance: button;
  &::-moz-focus-inner {
    border: 0;
  }
`;

const TriggerButton = styled(Button, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) && prop !== 'height' && prop !== 'width',
})(({ active, backgroundColor, height, width }) => ({
  backgroundColor,
  height,
  width,
  boxShadow: active ? '0 0 10px rgba(0,0,0,0.5) inset' : 'none',
  borderRadius: '4px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  display: 'block',
  position: 'relative',
  textDecoration: 'none',
  transition: 'box-shadow 0.15s ease-in-out',
  verticalAlign: 'middle',
}));

TriggerButton.propTypes = {
  active: PropTypes.bool,
  backgroundColor: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TriggerButton.defaultProps = {
  active: false,
  backgroundColor: '#ffffff',
  height: '5.6em',
  width: '5.6em',
};

const selector = ({ color, isActive, triggerElement, dispatch }) => ({
  color,
  isActive,
  triggerElement,
  dispatch,
});

const comparator = (
  { color, isActive, triggerElement, dispatch, height, width },
  {
    color: oldColor,
    isActive: oldIsActive,
    triggerElement: oldTriggerElement,
    dispatch: oldDispatch,
    height: oldHeight,
    width: oldWidth,
  }
) => {
  if (
    isActive !== oldIsActive ||
    height !== oldHeight ||
    width !== oldWidth ||
    triggerElement !== oldTriggerElement ||
    dispatch !== oldDispatch ||
    color?.h !== oldColor?.h ||
    color?.s !== oldColor?.s ||
    color?.v !== oldColor?.v
  ) {
    return false;
  }
};

class Trigger extends React.Component {
  triggerRef = React.createRef();

  toggleActive = (event) => {
    const { dispatch, isActive } = this.props;

    event.stopPropagation();
    dispatch(setIsActive(!isActive));
  };

  close = (event) => {
    const { current: trigger } = this.triggerRef;
    const { dispatch, isActive } = this.props;
    const { type, target, key, keyCode } = event;
    const modalElement = document.getElementById(MODAL_ID);
    let doClose = false;

    switch (type) {
      case 'keydown':
        if (isActive && (key === 'Escape' || key === 'Esc' || keyCode === 27)) {
          doClose = true;
        }
        break;
      case 'pointerdown':
        if (
          isActive &&
          target !== trigger &&
          (!modalElement || !modalElement.contains(target))
        ) {
          doClose = true;
        }
        break;
      default:
        break;
    }

    if (doClose) {
      dispatch(setIsActive(false));
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.close);
    document.addEventListener('pointerdown', this.close);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.close);
    document.removeEventListener('pointerdown', this.close);
  }

  render() {
    const { isActive, color, title, height, width } = this.props;

    return (
      <TriggerButton
        active={isActive}
        backgroundColor={chroma(color).hex()}
        onClick={this.toggleActive}
        ref={this.triggerRef}
        title={title}
        height={height}
        width={width}
        id={TRIGGER_ID}
      />
    );
  }
}

Trigger.propTypes = {
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      r: PropTypes.number,
      g: PropTypes.number,
      b: PropTypes.number,
    }),
    PropTypes.shape({
      h: PropTypes.number,
      s: PropTypes.number,
      v: PropTypes.number,
    }),
    PropTypes.shape({
      h: PropTypes.number,
      s: PropTypes.number,
      l: PropTypes.number,
    }),
    PropTypes.shape({
      l: PropTypes.number,
      a: PropTypes.number,
      b: PropTypes.number,
    }),
    PropTypes.shape({
      o: PropTypes.number,
      k: PropTypes.number,
      l: PropTypes.number,
      a: PropTypes.number,
      b: PropTypes.number,
    }),
    PropTypes.shape({
      l: PropTypes.number,
      c: PropTypes.number,
      h: PropTypes.number,
    }),
    PropTypes.shape({
      o: PropTypes.number,
      k: PropTypes.number,
      l: PropTypes.number,
      c: PropTypes.number,
      h: PropTypes.number,
    }),
    // @TODO add more chroma constructors, or simplify this (just PropTypes.object instead of all the shapes?).
  ]),
  isActive: PropTypes.bool,
  title: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dispatch: PropTypes.func,
};

Trigger.defaultProps = {
  color: 0xffffff,
  isActive: false,
  title: '',
  height: '5.6em',
  width: '5.6em',
};

export default withSelector(StoreContext, selector, comparator)(Trigger);
