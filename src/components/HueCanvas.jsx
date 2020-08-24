// src/components/HueCanvas
import React, {
  useCallback,
  useState,
} from 'react';
import styled from '@emotion/styled/macro';
import chroma from 'chroma-js';

import { canvasCrosshair } from 'constants/cursors';
import {
  setHue,
  useStoreContext,
} from 'store/Store';

const SlideCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: ${({ isDragging }) => isDragging ? 'none' : canvasCrosshair};
  margin: ${({ width }) => `0 ${width * .25}px`};
  pointer-events: auto;
  touch-action: none;
`;

SlideCanvas.displayName = 'SlideCanvas';

const HueCanvas = ({
  height,
  width,
  onColorChange,
}) => {
  const {
    color,
    dispatch,
  } = useStoreContext();
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerLeave = event => setIsDragging(false);

  const handlePointerMove = event => {
    event.preventDefault();
    event.stopPropagation();

    if (isDragging) {
      const ratio = height / 360;
      const hue = event.nativeEvent.offsetY / ratio;
      const nextColor = chroma.hsv(hue, color.s, color.v);
      dispatch(setHue(hue));
      onColorChange({ r: nextColor.get('rgb.r'), g: nextColor.get('rgb.g'), b: nextColor.get('rgb.b') });
    }
  };

  const handlePointerUp = event => {
    event.preventDefault();
    event.stopPropagation();

    if (isDragging) {
      const ratio = height / 360;
      const hue = event.nativeEvent.offsetY / ratio;
      const nextColor = chroma.hsv(hue, color.s, color.v);
      dispatch(setHue(hue));
      onColorChange({ r: nextColor.get('rgb.r'), g: nextColor.get('rgb.g'), b: nextColor.get('rgb.b') });
      setIsDragging(false);
    }
  };

  const canvas = useCallback(cnvs => {
    if (cnvs) {
      const ctx = cnvs.getContext('2d');

      if (width > 0 && height > 0) {
        const ratio = height / 360;
        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < height; row++) {
          const ratioRow = row / ratio;
          const rowColor = chroma({ h: ratioRow, s: 1, l: 0.5 });
          const { h: hue } = color;

          ctx.fillStyle = rowColor.hex();

          // if the hue in state is in this row, indicate it.
          if (hue >= ratioRow && hue < ratioRow + (1 / ratio)) {
            const inverse = chroma(0xffffff - parseInt(rowColor.hex().replace('#', ''), 16));
            ctx.fillStyle = inverse.hex();
          }

          ctx.fillRect(0, Math.ceil(row), width, Math.ceil(row));
        }
      }
    }
  }, [color, height, width]);

  return (
    <SlideCanvas ref={canvas} width={width} height={height}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      isDragging={isDragging}
    />
  );
};

export default HueCanvas;
