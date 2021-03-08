import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from 'react-native';
import Index from './src/index.js';
import Home from './src/components/home.js';
import ConfigProvider from './src/context.js';
import store from './src/redux/store.js';
import { Provider } from 'react-redux';

const App = ({ pageProps }) => {

  return (
    <Provider store={store}>
      <ConfigProvider>
        <Index {...pageProps} />
      </ConfigProvider>
    </Provider>
  );
}

export default App;