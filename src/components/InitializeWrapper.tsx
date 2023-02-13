import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import chroma from 'chroma-js';

import { setColor, setOnColorChange, useDispatch } from 'Store/Store';
import createHsvArray, { HsvArraySource } from 'Utility/createHsvArray';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: middle;
`;

type OnColorChangeHandler = (color: chroma.Color) => void;

type InitializeWrapperProps = {
  children: React.ReactNode;
  initialColor: HsvArraySource;
  onColorChange: OnColorChangeHandler;
};

const InitializeWrapper: React.FC<InitializeWrapperProps> = ({
  children,
  initialColor,
  onColorChange,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const [h, s, v]: [h: number, s: number, v: number] =
      createHsvArray(initialColor);

    dispatch(setOnColorChange(onColorChange));
    dispatch(setColor({ h, s, v }));
  }, [dispatch, initialColor]);

  return <Wrapper>{children}</Wrapper>;
};

export default InitializeWrapper;
