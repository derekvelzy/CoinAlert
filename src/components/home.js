import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client';
import Card from './card.js';
import Header from './header.js';
import Search from './search.js';
import Saved from './saved.js';
import { Context } from '../context.js';
// import AnimatedLoader from 'react-native-animated-loader';
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

  const registerForPushNotifications = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (!permission.granted) return;
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('notification toke', token);
    } catch (err) {
      console.log('error getting a token', err);
    }
  };

  useEffect(() => {
    registerForPushNotifications();
  }, [])

  useEffect(() => {
    if (allCoins.length > 0) setVisible(false);
  }, [allCoins])

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
      {/* <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("../loader/8195-loader-aniation.json")}
        animationStyle={styles.lottie}
        speed={1}
      /> */}
      <ScrollView style={styles.scroll}>
        <Search />
        {/* <Button title="send notif" onPress={async () => {
          await sendPushNotification('derek');
        }}/> */}
        <Text style={{...styles.category, marginTop: 48}}>Saved</Text>
        {savedCoins.map((c) => (
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
        ))}
        <Text style={{...styles.category, marginTop: 35}}>Crypto</Text>
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

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

const styles = StyleSheet.create({
  category: {
    marginLeft: Dimensions.get('window').width * 0.06,
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25,
    zIndex: 0,
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