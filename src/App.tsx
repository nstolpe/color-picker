import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';

import ColorPicker from 'Components/ColorPicker';

const AppWrapper = styled.div`
  position: relative;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const [rootElement, setRootElement] = useState(null);
  const rootElementRef = useCallback((element) => {
    if (element !== null) {
      setRootElement(element);
    }
  }, []);

  return (
    <AppWrapper ref={rootElementRef}>
      <ColorPicker
        modalContainerElement={rootElement}
        initialColor={'mediumvioletred'}
      />
    </AppWrapper>
  );
};

export default App;
