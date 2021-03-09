import React, { useState, useEffect, useRef, useContext, useReducer } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
import { useSpring, animated } from 'react-spring/native.js';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../context.js';
import { useSelector, useDispatch } from 'react-redux';

const AnimatedView = animated(View);

const Saved = ({ name, symbol, rank, supply, price, volume, percents, cap }) => {
  const { user, update } = useContext(Context);
  const { apiTime, time, saved } = useSelector(state => state.coin);

  const [pos, setPos] = useState(false);
  const [fixedPrice, setFixedPrice] = useState('0');
  const [upper, setUpper] = useState(saved[symbol] ? saved[symbol][0].toString() : '0');
  const [lower, setLower] = useState(saved[symbol] ? saved[symbol][1].toString() : '0');
  const [bgColor, setBgColor] = useState('rgb(240, 240, 245)');
  const [rangeErr, setRangeErr] = useState(false);
  const [numErr, setNumErr] = useState(false);

  const [priceX, setPriceX] = useState(price || '0');

  useEffect(() => {
    if (price[0] === '0') {
      setFixedPrice(price.substring(0, 6));
    } else {
      setFixedPrice(price.substring(0, price.indexOf('.') + 4));
    }
  }, [price]);


  useEffect(() => {
    getLimits();
  }, [price, pos]);

  useEffect(() => {
    if (price[0] === '0') {
      setFixedPrice(price.substring(0, 6));
    } else {
      setFixedPrice(price.substring(0, price.indexOf('.') + 4));
    }
  }, [])

  const getLimits = () => {
    firestore().collection('Users').doc(user.email).collection('Saved').doc(symbol).get()
    .then((res) => {
      const priceNum = Number.parseFloat(price.replace(/[,]/g, ""));
      if (res._data.lower > priceNum) {
        setBgColor('rgb(237, 194, 202)');
      } else if (res._data.upper <= priceNum) {
        setBgColor('rgb(197, 237, 194)');
      } else {
        setBgColor('rgb(240, 240, 245)');
      }
    })
  };

  const add = async() => {
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
      await firestore()
        .collection('Users')
        .doc(user.email)
        .collection('Saved')
        .doc(symbol)
        .set({
          coin: symbol,
          upper: upNum,
          lower: loNum,
        });
      update();
    } else {
      setNumErr(true);
    }
  };

  const remove = async() => {
    await firestore().collection('Users').doc(user.email).collection('Saved').doc(symbol).delete();
    update();
  };

  const springProps = useSpring({
    from: {
      overflow: 'hidden',
      height: 0,
      paddingLeft: Dimensions.get('window').width * 0.06,
      paddingRight: Dimensions.get('window').width * 0.06,
      backgroundColor: 'rgb(240, 240, 245)',
    },
    to: {
      overflow: 'hidden',
      height: pos ? 345 : 0,
      paddingLeft: Dimensions.get('window').width * 0.06,
      paddingRight: Dimensions.get('window').width * 0.06,
      backgroundColor: pos ? 'rgb(250, 250, 250)' : 'rgb(240, 240, 245)',
    }
  })

  return (
    <View style={{
      ...styles.container,
      backgroundColor: pos ? 'rgb(250, 250, 250)' : bgColor,
    }}>
      <TouchableOpacity
        style={{...styles.main,  backgroundColor: pos ? 'rgb(250, 250, 250)' : bgColor}}
        onPress={() => {
          setRangeErr(false);
          setNumErr(false);
          setPos(!pos)
        }}>
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
        <View style={styles.priceAndLimits}>
          <Text style={styles.price}>${fixedPrice}</Text>
          <Text>Upper: ${upper}</Text>
          <Text>Lower: ${lower}</Text>
        </View>
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
        <Text style={{...styles.boldText, marginTop: 20,}}>Set Upper & Lower Limit</Text>
        <Text style={{...styles.error, display: rangeErr ? 'flex' : 'none'}}>
          Upper Limit must be greater than Lower Limit
        </Text>
        <Text style={{...styles.error, display: numErr ? 'flex' : 'none'}}>
          Limits must be numbers
        </Text>
        <View style={styles.side}>
          <View style={styles.limitCont}>
            <Text>current: {saved[symbol] ? saved[symbol][0] : '0'}</Text>
            <View style={styles.limitDollar}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                value={upper}
                style={styles.limit}
                onChangeText={(e) => setUpper(e)}
              />
            </View>
          </View>
          <View style={styles.limitCont}>
            <Text>current: {saved[symbol] ? saved[symbol][1] : '0'}</Text>
            <View style={styles.limitDollar}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                value={lower}
                style={styles.limit}
                onChangeText={(e) => setLower(e)}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.submit} onPress={add}>
            <Icon name="check" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.remove}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              setPos(false);
              setTimeout(() => remove(), 270);
            }}
          >
            <Text style={styles.removeText}>Remove</Text>
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
    marginTop: 15,
    borderRadius: 14,
    shadowOffset: { height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    paddingLeft: 20,
    fontSize: 18
  },
  limitCont: {
    marginTop: 10,
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
    fontSize: 16,
    marginBottom: 5
  },
  priceAndLimits: {
    alignItems: 'flex-end',
  },
  remove: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  removeButton: {
    marginTop: 35,
    backgroundColor: 'rgb(20, 20, 20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 100,
    borderRadius: 14,
    shadowOffset: { height: 10 },
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  removeText: {
    color: 'white',
    fontSize: 16,
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
    alignSelf: 'flex-end',
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

export default Saved;