// src/components/InitializeWrapper.jsx
import styled from '@emotion/styled/macro';
import React, { useEffect } from 'react';
import chroma from 'chroma-js';

import { setColor, useStoreContext } from 'store/Store';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: middle;
`;

const hsvObject = color => {
  try {
    return chroma(color).hsv();
  } catch (e) {
    return [0, 0, 0];
  }
};

const InitializeWrapper = ({ children, initialColor }) => {
  const { dispatch } = useStoreContext();

  useEffect(() => {
    const color = hsvObject(initialColor);
    dispatch(setColor(...color));
  }, [dispatch, initialColor])

  return <Wrapper children={children}/>;
};

export default InitializeWrapper;
