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

const DemoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  position: relative;
`;
const onColorChange = (color: chroma.Color) => console.log(color.rgb());

const useColorPickerOptions = (): [
  string | undefined,
  React.RefCallback<HTMLElement>
] => {
  const [portalTargetSelector, setPortalTargetSelector] = useState<string>();
  const portalTargetSelectorCallbackRef =
    useCallback<ColorPickerTypes.CallbackRefCallbackFn>(
      (element: HTMLElement) => {
        setPortalTargetSelector(
          `${element.nodeName}.${Array.from(element.classList).join('.')}`
        );
      },
      []
    );
  return [portalTargetSelector, portalTargetSelectorCallbackRef];
};

type ColorPickerOptionsProps = {
  children: Function;
};

const ColorPickerOptions: React.FC<ColorPickerOptionsProps> = ({
  children,
}: ColorPickerOptionsProps) => {
  const [portalTargetSelector, portalTargetSelectorCallbackRef]: [
    string | undefined,
    React.Ref<HTMLDivElement>
  ] = useColorPickerOptions() as [
    string | undefined,
    React.Ref<HTMLDivElement>
  ];

  return children(portalTargetSelector, portalTargetSelectorCallbackRef);
};

const HookApp = () => {
  const [portalTargetSelector, portalTargetSelectorCallbackRef] =
    useColorPickerOptions() as [string | undefined, React.Ref<HTMLDivElement>];

  return (
    <AppWrapper ref={portalTargetSelectorCallbackRef}>
      <ColorPicker
        portalTargetSelector={portalTargetSelector}
        initialColor={'mediumvioletred'}
        onColorChange={onColorChange}
      />
    </AppWrapper>
  );
};

const RenderPropApp = () => (
  <ColorPickerOptions>
    {(
      portalTargetSelector: string,
      portalTargetSelectorCallbackRef: React.Ref<HTMLDivElement>
    ) => (
      <AppWrapper ref={portalTargetSelectorCallbackRef}>
        <ColorPicker
          portalTargetSelector={portalTargetSelector}
          initialColor={'skyblue'}
          onColorChange={onColorChange}
        />
      </AppWrapper>
    )}
  </ColorPickerOptions>
);

const Demo = () => (
  <DemoWrapper>
    <HookApp />
    <RenderPropApp />
  </DemoWrapper>
);

export default Demo;
