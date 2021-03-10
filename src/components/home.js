import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from 'react-native';
import io from 'socket.io-client';
import Card from './card.js';
import Header from './header.js';
import Search from './search.js';
import Saved from './saved.js';
import { Context } from '../context.js';
import { useSelector, useDispatch } from 'react-redux';
import { sortData } from '../redux/coins.js';

const socket = io.connect('http://ec2-13-52-237-73.us-west-1.compute.amazonaws.com:8020');


const Home = () => {
  const { user, update, setLoginLoad } = useContext(Context);
  const { apiTime, sortMethod, allCoins, coins, savedCoins, saved } = useSelector(state => state.coin);
  const { search } = useSelector(state => state.search);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(true);
  const [reset, setReset] = useState(true);

  useEffect(() => {
    if (allCoins.length > 0) setVisible(false);
  }, [allCoins]);

  useEffect(() => {
    if (user) {
      setLoginLoad(false);
      update();
    }
  }, [user]);

  useEffect(() => {
    if (saved && search === '') {
      socket.on('update', (n) => {
        console.log('updated');
        dispatch(sortData({data: n, s: saved}))
        setReset(!reset);
      });
    }
    return () => { socket.off('update') };
  }, [saved, apiTime, sortMethod, search])

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scroll}>
        <Search />
        {user.email ? <Text style={{...styles.category, marginTop: 48}}>Saved</Text> : <View />}
        {user.email ? savedCoins.map((c) => (
          <Saved
            key={c.symbol}
            name={c.name}
            symbol={c.symbol}
            rank={c.rank}
            supply={c.circsupply}
            price={c.price}
            volume={c.volume}
            percents={{hour: c.hour, day: c.day, week: c.week, month: c.month}}
            cap={c.cap}
          />
        )) : <View />}
        <Text style={{...styles.category, marginTop: 35}}>All Cryptocurrencies</Text>
        {coins.map((c) => (
          <Card
            key={c.symbol}
            name={c.name}
            symbol={c.symbol}
            rank={c.rank}
            supply={c.circsupply}
            price={c.price}
            volume={c.volume}
            percents={{hour: c.hour, day: c.day, week: c.week, month: c.month}}
            cap={c.cap}
          />
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  category: {
    marginLeft: Dimensions.get('window').width * 0.06,
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25,
    zIndex: 0,
    fontFamily: 'Avenir-Medium',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 245)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    height: 130,
  },
  scroll: {
    height: Dimensions.get('window').height * 0.80,
    width: Dimensions.get('window').width,
  }
});

export default Home;