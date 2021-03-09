import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
import { useSpring, animated } from 'react-spring/native.js';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../context.js';
import { useSelector, useDispatch } from 'react-redux';
import { setSearch } from '../redux/search.js';

const AnimatedView = animated(View);

const Card = ({ name, symbol, rank, supply, price, volume, percents, cap }) => {
  const { user, update } = useContext(Context);
  const { apiTime, time } = useSelector(state => state.coin);
  const dispatch = useDispatch();

  const [pos, setPos] = useState(false);
  const [fixedPrice, setFixedPrice] = useState('0');
  const [upper, setUpper] = useState('0');
  const [lower, setLower] = useState('0');
  const [rangeErr, setRangeErr] = useState(false);
  const [numErr, setNumErr] = useState(false);

  useEffect(() => {
    if (price[0] === '0') {
      setFixedPrice(price.substring(0, 6));
    } else {
      setFixedPrice(price.substring(0, price.indexOf('.') + 4));
    }
  }, [price]);

  useEffect(() => {
    if (price[0] === '0') {
      setFixedPrice(price.substring(0, 6));
    } else {
      setFixedPrice(price.substring(0, price.indexOf('.') + 4));
    }
  }, [])

  const add = async () => {
    const upNum = Number.parseFloat(upper);
    const loNum = Number.parseFloat(lower);
    setRangeErr(false);
    setNumErr(false);
    if (upNum <= loNum) {
      setRangeErr(true);
    } else if (
      typeof upNum === 'number' && (upNum || upNum === 0) &&
      typeof loNum === 'number' && (loNum || loNum === 0)
    ) {
      setPos(false);
      await firestore()
        .collection('Users')
        .doc(user.email)
        .collection('Saved')
        .doc(symbol)
        .set({
          coin: symbol,
          upper: upNum,
          lower: loNum,
        })
      update();
      dispatch(setSearch(''));
    } else {
      setNumErr(true);
    }
  };

  const springProps = useSpring({
    from: {
      overflow: 'hidden',
      height: 0,
      paddingLeft: Dimensions.get('window').width * 0.06,
      paddingRight: Dimensions.get('window').width * 0.06,
    },
    to: {
      overflow: 'hidden',
      height: pos ? 230 : 0,
      paddingLeft: Dimensions.get('window').width * 0.06,
      paddingRight: Dimensions.get('window').width * 0.06,
    }
  })

  return (
    <View style={{...styles.container, backgroundColor: pos ? 'rgb(250, 250, 250)' : 'rgb(240, 240, 245)'}}>
      <TouchableOpacity
        style={{...styles.main, backgroundColor: pos ? 'rgb(250, 250, 250)' : 'rgb(240, 240, 245)'}}
        onPress={() => {
          setRangeErr(false);
          setNumErr(false);
          setPos(!pos)
        }}
      >
        <View style={styles.left}>
          <Image
            style={styles.img}
            source={{uri: `https://grouply.s3-us-west-1.amazonaws.com/cryptos/${symbol}.png`}}
          />
          <View style={styles.name}>
            <View style={styles.namesymbol}>
              <Text style={styles.bold}>{symbol}</Text>
              <Text style={styles.fullname}>{name}</Text>
            </View>
            <Text>{time}: {Number.parseFloat(percents[apiTime]).toFixed(3)} %</Text>
          </View>
        </View>
        <Text style={styles.price}>${fixedPrice}</Text>
      </TouchableOpacity>
      <AnimatedView style={springProps}>
        <View style={styles.drawer}>
          <View style={styles.drawerLeft}>
            <Text style={styles.boldText}>Popularity:</Text>
            <Text style={styles.stat}>{rank}</Text>
            <Text style={styles.boldText}>Volume:</Text>
            <Text style={styles.stat}>{volume.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</Text>
          </View>
          <View style={styles.drawerRight}>
            <Text style={styles.boldText}>Market Cap:</Text>
            <Text style={styles.stat}>${cap.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</Text>
            <Text style={styles.boldText}>Circulating Supply:</Text>
            <Text style={styles.stat}>{supply.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</Text>
          </View>
        </View>
        <Text style={{...styles.boldText, marginTop: 20}}>Set Upper & Lower Limit</Text>
        <Text style={{...styles.error, display: rangeErr ? 'flex' : 'none'}}>
          Upper Limit must be greater than Lower Limit
        </Text>
        <Text style={{...styles.error, display: numErr ? 'flex' : 'none'}}>
          Limits must be numbers
        </Text>
        <View style={styles.side}>
          <View style={styles.limitDollar}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              value={upper}
              style={styles.limit}
              onChangeText={(e) => setUpper(e)}
            />
          </View>
          <View style={styles.limitDollar}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              value={lower}
              style={styles.limit}
              onChangeText={(e) => setLower(e)}
            />
          </View>
          <TouchableOpacity
            style={styles.submit}
            onPress={add}>
            <Icon name="check" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </AnimatedView>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 14,
  },
  boldText: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    width: Dimensions.get('window').width,
    overflow: 'hidden',
  },
  drawer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  drawerLeft: {

  },
  drawerRight: {

  },
  dollar: {
    marginTop: 15,
    marginRight: 5
  },
  error: {
    color: 'red'
  },
  fullname: {
    fontSize: 14,
  },
  img: {
    width: 45,
    height: 45,
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingLeft: Dimensions.get('window').width * 0.06,
    paddingRight: Dimensions.get('window').width * 0.06,
  },
  limit: {
    backgroundColor: 'white',
    height: 45,
    width: Dimensions.get('window').width * 0.26,
    marginTop: 10,
    borderRadius: 14,
    shadowOffset: { height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    paddingLeft: 20,
    fontSize: 18
  },
  limitDollar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: Dimensions.get('window').width * 0.88,
    marginLeft: Dimensions.get('window').width * 0.06,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 0.5,
  },
  main: {
    width: Dimensions.get('window').width * 0.88,
    height: 80,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(240, 240, 245)',
    zIndex: 2,
  },
  name: {
    marginLeft: 20,
  },
  namesymbol: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  price: {
    fontSize: 16
  },
  side: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submit: {
    height: 45,
    width: 45,
    backgroundColor: 'rgb(250, 204, 50)',
    borderRadius: 14,
    marginTop: 10,
    shadowOffset: { height: 10, },
    shadowColor: 'rgb(217, 178, 39)',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: {
    marginBottom: 5,
    fontSize: 14,
  }
});

export default Card;