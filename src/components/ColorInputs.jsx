// src/components/ColorInputs.jsx
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled/macro';
import chroma from 'chroma-js';

import { StoreContext } from 'Store/Store';
import withSelector from 'Components/withSelector';

const ValuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1em;
  justify-content: flex-start;
  line-height: 1.5;
  pointer-events: none;
`;

ValuesWrapper.displayName = 'ValuesWrapper';

const ValueLabel = styled.label`
  display: flex;
  font-family: sans-serif;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 1em;
  user-select: none;
`;

ValueLabel.displayName = 'ValueLabel';

const ValueSpan = styled.span`
  color: hsl(0,0%,25%);
  font-family: ${({ fontFamily }) => fontFamily};
  margin-right: 0.5em;
`;

ValueSpan.displayName = 'ValueSpan';

const Input = styled.input`
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 4px hsl(0,0%,25%) inset;
  box-sizing: border-box;
  cursor: text;
  font-size: 1em;
  line-height: 1.5;
  padding: 0 0.5em;
  width: 8em;
`;

Input.displayName = 'Input';

const selector = ({
  color,
  isActive,
  isModalDragging,
}) => ({
  color,
  isActive,
  isModalDragging,
});

const comparator = ({
  color,
  isActive,
  isModalDragging,
}, {
  color: oldColor,
  isActive: oldIsActive,
  isModalDragging: oldIsModalDragging,
}) => {
  if (
    isActive !== oldIsActive ||
    isModalDragging !== oldIsModalDragging ||
    color?.h !== oldColor?.h ||
    color?.s !== oldColor?.s ||
    color?.v !== oldColor?.v
  ) {
    return false;
  }
};

const ColorInputs = ({
  color: { h, s, v } = {},
  isActive,
  isModalDragging,
  labelFontFamily,
}) => {
  const color = chroma.hsv(h, s, v);

  return (
    <ValuesWrapper>
      <ValueLabel>
        <ValueSpan fontFamily={labelFontFamily}>rgb:</ValueSpan>
        <Input
          type="text"
          value={`${color.get('rgb.r')}/${color.get('rgb.g')}/${color.get('rgb.b')}`}
          disabled={isActive && !isModalDragging ? false : true}
        />
      </ValueLabel>
      <ValueLabel>
        <ValueSpan fontFamily={labelFontFamily}>hsv:</ValueSpan>
        <Input
          type="text"
          value={`${Math.round(h * 100) / 100}/${Math.round(s * 100) / 100}/${Math.round(v * 100) / 100}`}
          readOnly
          disabled={isActive && !isModalDragging ? false : true}
        />
      </ValueLabel>
      <ValueLabel>
        <ValueSpan fontFamily={labelFontFamily}>hex:</ValueSpan>
        <Input
          type="text"
          value={color.hex().replace('#', '')}
          readOnly
          disabled={isActive && !isModalDragging ? false : true}
        />
      </ValueLabel>
    </ValuesWrapper>
  );
};

ColorInputs.propTypes = {
  labelFontFamily: PropTypes.string,
};

ColorInputs.defaultProps = {
  labelFontFamily: 'sans-serif',
};

export default withSelector(StoreContext, selector, comparator)(ColorInputs);
