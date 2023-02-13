import React, { createContext, useContext, useMemo } from 'react';

import useCustomCompareMemo, {
  defaultComparator,
} from 'Hooks/useCustomCompareMemo';

/**
 * HOC that returns a memoized version of the wrapped component that has
 * isolated access to data available in the `context` argument. Data from
 * `context` is chosen by the `selector` function, which should take the
 * context's data as its only argument. The wrapped component will receive
 * the return value of `selector` as props.
 *
 * @param context    {object}    A React Context
 * @param selector   {Function}  A function that retrieves data from the context
 * @param comparator {Function}  A function that takes two arguments and compares them.
 * @param WrappedComponent {object}  A React Component
 */
export const withSelector =
  (
    context: React.Context<any> = createContext(null),
    selector: ColorPickerTypes.SelectorFn,
    comparator: ColorPickerTypes.ComparatorFn = defaultComparator
  ) =>
  (WrappedComponent: React.ComponentType): React.ComponentType => {
    const WrapperComponent = (props: Record<string, any>): JSX.Element => {
      const ctx = selector(useContext(context));
      const contextProps = useCustomCompareMemo(ctx, comparator);

      return useMemo(
        () => <WrappedComponent {...{ ...contextProps, ...props }} />,
        [contextProps, props]
      );
    };

    return WrapperComponent;
  };

export default withSelector;
