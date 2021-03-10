// src/components/HueCanvas
import React, {
  useCallback,
  useState,
} from 'react';
import styled from '@emotion/styled/macro';
import chroma from 'chroma-js';

import {
  setHue,
  useDispatch,
  StoreContext,
} from 'store/Store';
import withSelector from 'components/withSelector';

const SlideCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: none;
  margin: ${({ width }) => `0 ${width * .25}px`};
  pointer-events: ${({ isActive }) => isActive ? 'auto' : 'none'};
  touch-action: none;
  // flip it so 0 is bottom and 360 is top
  transform: rotate(180deg);
`;

SlideCanvas.displayName = 'SlideCanvas';

export const clamp = (n, min, max) => n > max ? max : n < min ? min : n;

const selector = ({
  color,
  isActive,
}) => ({
  color,
  isActive,
});

const comparator = ({
  color,
  isActive,
}, {
  color: oldColor,
  isActive: oldIsActive,
}) => {
  if (
    isActive !== oldIsActive ||
    color?.h !== oldColor?.h ||
    color?.s !== oldColor?.s ||
    color?.v !== oldColor?.v
  ) {
    return false;
  }
};

const HueCanvas = ({
  color,
  isActive,
  height,
  width,
  onColorChange,
}) => {
  const dispatch = useDispatch()
  const [isDragging, setIsDragging] = useState(false);
  const [verticalHoverCoord, setVerticalHoverCoord] = useState(undefined);

  const handleDragUpdate = event => {
    const ratio = 360 / height;
    const hue = clamp(event.nativeEvent.offsetY * ratio, 0, 359);
    const nextColor = chroma.hsv(hue, color.s, color.v);
    dispatch(setHue(hue));
    onColorChange({ r: nextColor.get('rgb.r'), g: nextColor.get('rgb.g'), b: nextColor.get('rgb.b') });
  };

  const handlePointerDown = event => {
    const { pointerId, target } = event;
    event.preventDefault();
    event.stopPropagation();
    target.setPointerCapture(pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = event => {
    event.preventDefault();
    event.stopPropagation();

    setVerticalHoverCoord(Math.floor(event.nativeEvent.offsetY));

    if (isDragging) {
      handleDragUpdate(event);
    }
  };

  const handlePointerUp = event => {
    const { pointerId, target } = event;
    event.preventDefault();
    event.stopPropagation();
    target.releasePointerCapture(pointerId);

    if (isDragging) {
      handleDragUpdate(event);
      setIsDragging(false);
    }
  };

  const handlePointerLeave = () => setVerticalHoverCoord(undefined);

  const canvas = useCallback(cnvs => {
    if (cnvs) {
      const ctx = cnvs.getContext('2d');

      if (width > 0 && height > 0) {
        const ratio =  360 / height;
        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < height; row++) {
          const scaledHue = row * ratio;
          const rowColor = chroma({ h: scaledHue, s: 1, l: 0.5 });
          const { h: hue } = color;

          ctx.fillStyle = rowColor.hex();

          // if the hue in state is in this row, indicate it.
          if (hue >= scaledHue && hue < scaledHue + ratio) {
            const inverse = chroma(0xffffff - parseInt(rowColor.hex().replace('#', ''), 16));
            ctx.fillStyle = inverse.hex();
          } else if (row >= verticalHoverCoord && row < verticalHoverCoord + ratio) {
            const inverse = chroma(0xffffff - parseInt(rowColor.hex().replace('#', ''), 16));
            ctx.fillStyle = inverse.brighten(2).desaturate(1).hex();
          }

          ctx.fillRect(0, row, width, 1);
        }
      }
    }
  }, [color, verticalHoverCoord, height, width]);

  return (
    <SlideCanvas ref={canvas} width={width} height={height}
      isActive={isActive}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      isDragging={isDragging}
    />
  );
};

export default withSelector(StoreContext, selector, comparator)(HueCanvas);
