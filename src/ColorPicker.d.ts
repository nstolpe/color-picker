declare namespace ColorPickerTypes {
  type StateObject = Record<string, any>;
  /**
   * Signature for comparator function (takes a and b, maybe compares some things
   * about them, and returns a boolean)
   * Copied from react-redux:
   * https://github.com/reduxjs/react-redux/blob/7b6270db25467d700c7300bfc8a023018cbeb65e/src/types.ts#L11
   */
  type ComparatorFn = (
    x: ColorPickerTypes.StateObject,
    y: ColorPickerTypes.StateObject
  ) => boolean;

  type SelectorFn = (x: Record<string, any>) => ColorPickerTypes.StateObject;

  type CallbackRefCallbackFn = (element: HTMLElement) => void;

  type ChromaSource = string | number | chroma.Color;
}

export = ColorPickerTypes;
export as namespace ColorPickerTypes;
