// src/components/SaturationValueCanvas
import React, {
  useCallback,
  useState,
} from 'react';
import styled from '@emotion/styled/macro';
import chroma from 'chroma-js';

import {
  setSaturation,
  setValue,
  useDispatch,
  StoreContext,
} from 'store/Store';
import withSelector from 'components/withSelector';
import { clamp } from 'components/HueCanvas';

const PadCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: none;
  pointer-events: ${({ isActive }) => isActive ? 'auto' : 'none'};
  touch-action: none;
`;

PadCanvas.displayName = 'PadCanvas';

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

const SaturationValueCanvas = ({
  color,
  isActive,
  height,
  width,
  onColorChange,
}) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [hoverCoords, setHoverCoords] = useState(null);

  /**
   * Updates the color in state and calls the color change callback.
   */
  const handleUpdateColorFromCoordinates = ({ x, y }) => {
    const { h } = color;
    const s = x / width;
    const v = 1 - (y / height);

    const nextColor = chroma({ h, s, v });

    dispatch(setSaturation(s));
    dispatch(setValue(v));
    onColorChange({ r: nextColor.get('rgb.r'), g: nextColor.get('rgb.g'), b: nextColor.get('rgb.b') });
  };

  const handlePointerDown = event => {
    const { pointerId, target } = event;
    event.preventDefault();
    event.stopPropagation();
    target.setPointerCapture(pointerId);
    setIsDragging(true);
  }

  const handlePointerMove = event => {
    const { nativeEvent: { offsetX: x, offsetY: y } } = event;
    event.preventDefault();
    event.stopPropagation();

    setHoverCoords({
      x: Math.floor(x),
      y: Math.floor(y),
    });

    if (isDragging) {
      handleUpdateColorFromCoordinates({
        x: clamp(x, 0, width - 1),
        y: clamp(y, 0, height - 1),
      });
    }
  };

  const handlePointerUp = event => {
    const { pointerId, target } = event;
    event.preventDefault();
    event.stopPropagation();
    target.releasePointerCapture(pointerId);

    if (isDragging) {
      const { nativeEvent: { offsetX: x, offsetY: y } } = event;
      handleUpdateColorFromCoordinates({
        x: clamp(x, 0, width - 1),
        y: clamp(y, 0, height - 1),
      });
      setIsDragging(false);
    }
  };

  const handlePointerLeave = event => setHoverCoords(null);

  const canvas = useCallback(cnvs => {
    if (cnvs && width > 0 && height > 0) {
      const ctx = cnvs.getContext('2d');
      const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
      const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
      const { h, s, v } = color;

      // only need the hue for the background hex.
      const nextColor = chroma({ h: h, s: 1, v: 1 });
      const hex = nextColor.hex();
      // get x from saturation and y from value.
      const x = s * width;
      const y = v * height;
      ctx.clearRect(0, 0, width, height);

      // saturation gradient: white-to-transparent, left-to-right
      saturationGradient.addColorStop(0, 'rgba(255,255,255,1)');
      saturationGradient.addColorStop(1, 'rgba(255,255,255,0)');
      // value gradient: black-to-transparent, bottom-to-top
      valueGradient.addColorStop(0, 'rgba(0,0,0,0)');
      valueGradient.addColorStop(1, 'rgba(0,0,0,1)');

      // draw the active color's hue
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, width, height);

      // draw the saturation gradient
      ctx.fillStyle = saturationGradient;
      ctx.fillRect(0, 0, width, height);

      // draw the svalue gradient
      ctx.fillStyle = valueGradient;
      ctx.fillRect(0, 1, width, height);

      // ensure the first pixel is white, the gradient might have overwritten it.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1, 1);

      // ensure the pixel at `width - 1`, `0` is the hue, the gradient
      // might have overwriten it.
      ctx.fillStyle = hex;
      ctx.fillRect(width - 1, 0, 1, 1);

      /**
       * draw the cursor
       */
       // @TODO this is the hover cursor. move to its own function.
      if (hoverCoords && !isDragging) {
        const topPixel = ctx.getImageData(hoverCoords.x, hoverCoords.y - 8, 1, 1).data;
        const bottomPixel = ctx.getImageData(hoverCoords.x, hoverCoords.y + 8, 1, 1).data;
        const leftPixel = ctx.getImageData(hoverCoords.x - 8, hoverCoords.y, 1, 1).data;
        const rightPixel = ctx.getImageData(hoverCoords.x + 8, hoverCoords.y, 1, 1).data;

        const verticalGradient = ctx.createLinearGradient(x, y - 8, x, y + 8);
        const horizontalGradient = ctx.createLinearGradient(x - 8, y, x + 8, y);

        const horizontalStart = chroma(leftPixel[0], leftPixel[1], leftPixel[2])
          .brighten(2)
          .desaturate(1);
        const horizontalEnd = chroma(rightPixel[0], rightPixel[1], rightPixel[2])
          .brighten(2)
          .desaturate(1);
        const verticalStart = chroma(topPixel[0], topPixel[1], topPixel[2])
          .brighten(2)
          .desaturate(1);
        const verticalEnd = chroma(bottomPixel[0], bottomPixel[1], bottomPixel[2])
          .brighten(2)
          .desaturate(1);

        verticalGradient.addColorStop(0, `${verticalStart.hex()}`);
        verticalGradient.addColorStop(1, `${verticalEnd.hex()}`);

        horizontalGradient.addColorStop(0, `${horizontalStart.hex()}`);
        horizontalGradient.addColorStop(1, `${horizontalEnd.hex()}`);

        ctx.fillStyle = verticalGradient;
        ctx.fillRect(hoverCoords.x, hoverCoords.y - 8, 1, 17);

        ctx.fillStyle = horizontalGradient;
        ctx.fillRect(hoverCoords.x - 8, hoverCoords.y, 17, 1);
      }

      // get first and last pixels on row and column
      const rowFirst = ctx.getImageData(0, height - y, 1, 1).data;
      const rowLast = ctx.getImageData(width - 1, height - y, 1, 1).data;

      const colFirst = ctx.getImageData(x, 0, 1, 1).data;
      const colLast = ctx.getImageData(x, height - 1, 1, 1).data;

      // create gradients
      const rowGradient = ctx.createLinearGradient(0, height - y, width, 1);
      const colGradient = ctx.createLinearGradient(x, 0, 1, height);

      // create inverse gradients from first and last row and column pixel values
      rowGradient.addColorStop(0, `rgba(${255 - rowFirst[0]},${255 - rowFirst[1]},${255 - rowFirst[2]},1)`);
      rowGradient.addColorStop(1, `rgba(${255 - rowLast[0]},${255 - rowLast[1]},${255 - rowLast[2]},1)`);
      colGradient.addColorStop(0, `rgba(${255 - colFirst[0]},${255 - colFirst[1]},${255 - colFirst[2]},1)`);
      colGradient.addColorStop(1, `rgba(${255 - colLast[0]},${255 - colLast[1]},${255 - colLast[2]},1)`);

      // draw the gradients
      ctx.fillStyle = rowGradient;
      ctx.fillRect(0, height - y, width, 1);

      ctx.fillStyle = colGradient;
      ctx.fillRect(x, 0, 1, height);
    }
  }, [color, hoverCoords, isDragging, height, width]);

  return (
    <PadCanvas ref={canvas} width={width} height={height}
      isActive={isActive}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      isDragging={isDragging}
    />
  );
};

export default withSelector(StoreContext, selector, comparator)(SaturationValueCanvas);
