import React, { useContext } from 'react';

import useCustomCompareMemo, {
  defaultComparator,
} from 'Hooks/useCustomCompareMemo';

const useSelector = (
  context: React.Context<ColorPickerTypes.StateObject>,
  selector: ColorPickerTypes.SelectorFn,
  comparator: ColorPickerTypes.ComparatorFn = defaultComparator
) => useCustomCompareMemo(selector(useContext(context)), comparator);

export default useSelector;
