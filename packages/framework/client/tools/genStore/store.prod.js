/**
 * Created by ink on 2018/4/9.
 */
import { createStore } from 'redux';

export default function genStore(reducers, initialState = {}, enhancer) {
  const store = createStore(reducers, initialState, enhancer);
  return store;
}
