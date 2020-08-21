import React, { useCallback, useState } from 'react';

import './App.css';
import ColorPicker from 'components/ColorPicker';

const App = () => {
  const [rootElement, setRootElement] = useState(null);
  const rootElementRef = useCallback(element => {
    // debugger;
    if (element !== null) {
      setRootElement(element);
    }
  });

  return (
    <div className="App" ref={rootElementRef}>
      <ColorPicker modalContainerElement={rootElement}/>
    </div>
  );
}

export default App;
