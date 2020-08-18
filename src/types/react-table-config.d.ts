/* eslint-disable functional/prefer-type-literal, @typescript-eslint/ban-types */

// Add plugins using the template at the following link:
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table

import {
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table';

declare module 'react-table' {
  // Take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends object> extends UseSortByOptions<D> {}
  // Note that having Record here allows you to add anything to the options, this matches the spirit of the
  // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
  // feature set, this is a safe default.
  // Record<string, any>

  export interface Hooks<D extends object = Record<string, unknown>>
    extends UseSortByHooks<D> {}

  export interface TableInstance<D extends object = Record<string, unknown>>
    extends UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = Record<string, unknown>>
    extends UseSortByState<D> {}

  export interface ColumnInterface<D extends object = Record<string, unknown>>
    extends UseSortByColumnOptions<D> {}

  export interface ColumnInstance<D extends object = Record<string, unknown>>
    extends UseSortByColumnProps<D> {}

  // Export interface Cell<D extends object = Record<string, unknown>, V = any>
  //   extends {}

  // export interface Row<D extends object = Record<string, unknown>>
  //   extends {}
}
