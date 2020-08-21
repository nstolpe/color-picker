// src/components/InitializeWrapper.jsx
import styled from '@emotion/styled/macro';

import React, { useEffect } from 'react';

import { setActiveColor, useStoreContext } from 'store/Store';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: middle;
`;

const InitializeWrapper = ({ children, initialColor }) => {
  const { dispatch } = useStoreContext();
  useEffect(() => {
    dispatch(setActiveColor(initialColor));
  }, [initialColor])

  return <Wrapper children={children}/>;
};
export default InitializeWrapper;
