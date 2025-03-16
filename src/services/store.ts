import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  constructorItemsSlice,
  feedsSlice,
  ingredientsSlice,
  orderRequestSlice,
  profileSlice
} from '@slices';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorItemsSlice,
  profileSlice,
  feedsSlice,
  orderRequestSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
