import { createSlice } from '@reduxjs/toolkit';

export const coinSlice = createSlice({
  name: 'Coins',
  initialState: {
    allCoins: [],
    coins: [],
    savedCoins: [],
    saved: {},
    apiTime: 'hour',
    time: 'Live',
    sortMethod: false
  },
  reducers: {
    setTime: (state, action) => {
      state.apiTime = action.payload;
      if (action.payload === 'hour') {
        state.time = 'Live';
      } else if (action.payload === 'day') {
        state.time = '24 Hrs';
      } else if (action.payload === 'week') {
        state.time = '1 Week';
      } else {
        state.time = '30 Days';
      }
    },
    setSortMethod: (state, action) => {
      state.sortMethod = action.payload;
    },
    setAllCoins: (state, action) => {
      state.allCoins = action.payload;
    },
    setCoins: (state, action) => {
      state.coins = action.payload;
    },
    setSavedCoins: (state, action) => {
      state.savedCoins = action.payload;
    },
    setSaved: (state, action) => {
      state.saved = action.payload;
    },
    timeSort: (state, action) => {
      state.savedCoints = state.savedCoins.slice()
      .sort((a, b) => (
        action.payload.type ?
        b[action.payload.time] - a[action.payload.time] :
        a.rank - b.rank
      ));

      state.coins = state.coins.slice()
      .sort((a, b) => (
        action.payload.type ?
        b[action.payload.time] - a[action.payload.time] :
        a.rank - b.rank
      ));
    },
    searchSort: (state, action) => {
      const helper = (name) => name.toLowerCase().includes(action.payload.toLowerCase());
      state.savedCoins = state.allCoins.slice()
        .filter((a) => { if ((helper(a.name) || helper(a.symbol)) && state.saved[a.symbol]) return a })
        .sort((a, b) => state.sortMethod ? b[state.apiTime] - a[state.apiTime] : a.rank - b.rank);
      state.coins = state.allCoins.slice()
        .filter((a) => { if ((helper(a.name) || helper(a.symbol)) && !state.saved[a.symbol]) return a })
        .sort((a, b) => state.sortMethod ? b[state.apiTime] - a[state.apiTime] : a.rank - b.rank);
    },
    sortData: (state, action) => {
      console.log(state.savedCoins);
      state.allCoins = action.payload.data;
      state.savedCoins =
        action.payload.data
        .filter((a) => action.payload.s[a.symbol])
        .sort((a, b) => !state.sortMethod ? a.rank - b.rank : b[state.apiTime] - a[state.apiTime]);
      state.coins =
        action.payload.data
        .filter((a) => !action.payload.s[a.symbol])
        .sort((a, b) => !state.sortMethod ? a.rank - b.rank : b[state.apiTime] - a[state.apiTime]);
    }
  }
});

export const {
  setTime, setSortMethod, setAllCoins, setCoins,setSavedCoins,
  setSaved, timeSort, searchSort, sortData
} = coinSlice.actions;

export default coinSlice.reducer;