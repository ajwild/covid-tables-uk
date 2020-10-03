import { Context, createContext } from 'react';

const AreaTypeFilterContext: Context<readonly [any, any]> = createContext([
  null,
  () => null,
] as readonly [any, any]);

export default AreaTypeFilterContext;
