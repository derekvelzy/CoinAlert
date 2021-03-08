import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search.js';
import coinReducer from './coins.js';

export default configureStore({
  reducer: {
    search: searchReducer,
    coin: coinReducer,
  }
})