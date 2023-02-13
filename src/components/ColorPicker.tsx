import React from 'react';
import styled from '@emotion/styled';

import Modal from 'Components/Modal';
import Store, { StoreContext } from 'Store/Store';
import ColorInputs from 'Components/ColorInputs';
import Trigger from 'Components/Trigger';
import InitializeWrapper from 'Components/InitializeWrapper';
import HueCanvas from 'Components/HueCanvas';
import SaturationValueCanvas from 'Components/SaturationValueCanvas';

import noop from 'Utility/noop';

const ContentWrapper = styled.div`
  display: flex;
  pointer-events: none;
`;

type ColorPickerProps = {
  portalTargetSelector: string | undefined;
  // @TODO: expand initialColor
  initialColor: ColorPickerTypes.ChromaSource;
  padWidth?: number | string;
  padHeight?: number | string;
  slideWidth?: number | string;
  slideHeight?: number | string;
  triggerWidth?: number | string;
  triggerHeight?: number | string;
  title?: string;
  titleFontFamily?: string;
  valueFontFamily?: string;
  onColorChange: (color: chroma.Color) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  portalTargetSelector = null,
  initialColor,
  padWidth = 256,
  padHeight = 256,
  slideWidth = 48,
  slideHeight = 256,
  triggerWidth = '6.4em',
  triggerHeight = '6.4em',
  title = 'Color Picker',
  titleFontFamily = 'sans-serif',
  valueFontFamily = 'sans-serif',
  onColorChange = noop,
}) => {
  const modalContainerElement: HTMLElement | null = portalTargetSelector
    ? document.querySelector(portalTargetSelector)
    : null;

  return (
    <Store>
      <InitializeWrapper
        initialColor={initialColor}
        onColorChange={onColorChange}
      >
        <Trigger title={title} width={triggerWidth} height={triggerHeight} />
        <StoreContext.Consumer>
          {({ isActive }) =>
            modalContainerElement &&
            isActive && (
              <Modal
                container={modalContainerElement}
                title={title}
                titleFontFamily={titleFontFamily}
              >
                <ContentWrapper>
                  <SaturationValueCanvas width={padWidth} height={padHeight} />
                  <HueCanvas width={slideWidth} height={slideHeight} />
                  <ColorInputs />
                </ContentWrapper>
              </Modal>
            )
          }
        </StoreContext.Consumer>
      </InitializeWrapper>
    </Store>
  );
};

export default ColorPicker;
