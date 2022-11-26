// src/components/ColorPicker.jsx
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import Modal from 'Components/Modal';
import Store from 'Store/Store';
import ColorInputs from 'Components/ColorInputs';
import Trigger from 'Components/Trigger';
import InitializeWrapper from 'Components/InitializeWrapper';
import HueCanvas from 'Components/HueCanvas';
import SaturationValueCanvas from 'Components/SaturationValueCanvas';

const ContentWrapper = styled.div`
  display: flex;
  pointer-events: none;
`;

const ColorPicker = ({
  modalContainerElement,
  initialColor,
  padWidth,
  padHeight,
  slideWidth,
  slideHeight,
  triggerWidth,
  triggerHeight,
  title,
  titleFontFamily,
  onColorChange,
}) => (
  <Store>
    <InitializeWrapper initialColor={initialColor}>
      <Trigger title={title} width={triggerWidth} height={triggerHeight} />
      {modalContainerElement && (
        <Modal
          container={modalContainerElement}
          title={title}
          titleFontFamily={titleFontFamily}
        >
          <ContentWrapper>
            <SaturationValueCanvas
              width={padWidth}
              height={padHeight}
              onColorChange={onColorChange}
            />
            <HueCanvas
              width={slideWidth}
              height={slideHeight}
              onColorChange={onColorChange}
            />
            <ColorInputs />
          </ContentWrapper>
        </Modal>
      )}
    </InitializeWrapper>
  </Store>
);

ColorPicker.defaultProps = {
  modalContainerElement: document.body,
  color: 0xff0000,
  padWidth: 256,
  padHeight: 256,
  slideWidth: 48,
  slideHeight: 256,
  triggerWidth: '6.4em',
  triggerHeight: '6.4em',
  title: 'Color Picker',
  titleFontFamily: 'sans-serif',
  valueFontFamily: 'sans-serif',
  onColorChange: ({ r, g, b }) => ({ r, g, b }),
};

ColorPicker.propTypes = {
  modalContainerElement: PropTypes.object,
  color: PropTypes.number,
  padWidth: PropTypes.number,
  padHeight: PropTypes.number,
  slideWidth: PropTypes.number,
  slideHeight: PropTypes.number,
  triggerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  triggerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  titleFontFamily: PropTypes.string,
  valueFontFamily: PropTypes.string,
  onColorChange: PropTypes.func,
};

export default ColorPicker;
