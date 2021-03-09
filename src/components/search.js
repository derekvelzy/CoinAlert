import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSpring, animated } from 'react-spring/native.js';
import { Context } from '../context.js';
import { useSelector, useDispatch } from 'react-redux';
import { setTime } from '../redux/coins.js';
import { setSearch } from '../redux/search.js';
import { timeSort, setSortMethod, searchSort } from '../redux/coins.js';

const AnimatedView = animated(View);

const Search = () => {
  const { apiTime, time, sortMethod } = useSelector(state => state.coin);
  const { search } = useSelector(state => state.search);
  const dispatch = useDispatch();

  const [pos, setPos] = useState(false);
  const [selection, setSelection] = useState(false);
  const [modal, setModal] = useState(0);

  const handleChange = (e) => {
    dispatch(setSearch(e));
    dispatch(searchSort(e))
  }

  const searchBarProps = useSpring({
    from: {
      ...styles.searchbarBox
    },
    to: {
      ...styles.searchbarBox,
      width: pos ? Dimensions.get('window').width * 0.9 : Dimensions.get('window').width * 0.7
    },
    delay: pos ? 125 : 0
  });

  const optionsProps = useSpring({
    from: {...styles.options},
    to: {
      ...styles.options,
      right: pos ? 0 : -180,
      width: pos ? Dimensions.get('window').width * 0.9 : 50,
    },
    delay: pos ? 350 : 0
  });

  const padProps = useSpring({
    from: {...styles.pad},
    to: {...styles.pad, marginTop: pos ? 75 : 0},
    delay: pos ? 0 : 250
  });

  const filterBoxProps = useSpring({
    from: {...styles.filterBox},
    to: {
      ...styles.filterBox,
      height: pos ? 70 : 50,
      marginTop: pos ? 75 : 0,
      shadowOpacity: pos ? 0 : 0.5,
      shadowColor: pos ? 'rgba(0, 0, 0, 0)' : 'rgba(181, 153, 38, 1)',
      shadowOpacity: pos ? 0 : 0.5,
      paddingRight: pos ? 5 : 0,
    },
    delay: pos ? 0 : 250
  });

  const marginProps = useSpring({
    from: {marginTop: 0},
    to: {marginTop: pos ? 100 + modal : 0},
    delay: modal === 0 ? 300 : 0
  })

  const timeBoxProps = useSpring({
    from: {...styles.timeBox},
    to: {
      ...styles.timeBox,
      marginLeft: modal === 70 ? Dimensions.get('window').width * 0.05 : -Dimensions.get('window').width,
    },
    delay: modal === 70 ? 0 : 100
  })

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <AnimatedView style={searchBarProps}>
          <TextInput
            style={styles.searchbar}
            value={search}
            onChangeText={(e) => handleChange(e)}
          />
        </AnimatedView>
        <AnimatedView style={optionsProps}>
          <TouchableOpacity
            style={styles.history}
            onPress={() => {
              modal === 70 ? setModal(0) : setModal(70)
            }}
          >
            <Icon name="history" size={30} color="white" style={styles.time} />
            <Icon name="caret-down" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.buttonBox}>
            <TouchableOpacity
              onPress={() => {
                dispatch(setSortMethod(true));
                dispatch(timeSort({type: true, time: apiTime}));
              }}
              style={{
                ...styles.sortBy,
                backgroundColor: sortMethod ? 'white' : 'rgb(250, 204, 50)',
                borderColor: sortMethod ? 'rgb(250, 204, 50)' : 'white',
              }}
            >
              <Text style={{...styles.typeText, color: sortMethod ? 'rgb(60, 60, 60)' : 'white'}}>
                Movement
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(setSortMethod(false));
                dispatch(timeSort({type: false, time: apiTime}));
              }}
              style={{
                ...styles.sortBy,
                backgroundColor: sortMethod ? 'rgb(250, 204, 50)' : 'white',
                borderColor: sortMethod ? 'white' : 'rgb(250, 204, 50)'
              }}
            >
              <Text style={{...styles.typeText, color: sortMethod ? 'white' : 'rgb(60, 60, 60)'}}>
                Popularity
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedView>
        <AnimatedView style={padProps} />
        <AnimatedView style={filterBoxProps}>
          <TouchableOpacity style={styles.filter} onPress={() => {
            setPos(!pos);
            setModal(0);
          }}>
            <Icon name="sliders" size={30} color="white" />
          </TouchableOpacity>
        </AnimatedView>
      </View>
      <AnimatedView style={marginProps}/>
      <AnimatedView style={timeBoxProps}>
        <TouchableOpacity
          onPress={() => {
            setModal(0);
            dispatch(setTime('hour'));
            dispatch(timeSort({type: sortMethod, time: 'hour'}));
          }}
          style={{
            ...styles.timeButton,
            backgroundColor: time === 'Live' ? 'rgb(250, 204, 50)' : 'white',
            borderWidth: time === 'Live' ? 0 : 1,
          }}
        >
          <Text style={{...styles.typeText, color: time === 'Live' ? 'white' : 'rgb(60, 60, 60)'}}>
            Live
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModal(0);
            dispatch(setTime('day'))
            dispatch(timeSort({type: sortMethod, time: 'day'}));
          }}
          style={{
            ...styles.timeButton,
            backgroundColor: time === '24 Hrs' ? 'rgb(250, 204, 50)' : 'white',
            borderWidth: time === '24 Hrs' ? 0 : 1,
          }}
        >
          <Text style={{...styles.typeText, color: time === '24 Hrs' ? 'white' : 'rgb(60, 60, 60)'}}>
            24 Hrs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModal(0);
            dispatch(setTime('week'));
            dispatch(timeSort({type: sortMethod, time: 'week'}));
          }}
          style={{
            ...styles.timeButton,
            backgroundColor: time === '1 Week' ? 'rgb(250, 204, 50)' : 'white',
            borderWidth: time === '1 Week' ? 0 : 1,
          }}
        >
          <Text style={{...styles.typeText, color: time === '1 Week' ? 'white' : 'rgb(60, 60, 60)'}}>
            1 Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModal(0);
            dispatch(setTime('month'))
            dispatch(timeSort({type: sortMethod, time: 'month'}));
          }}
          style={{
            ...styles.timeButton,
            backgroundColor: time === '30 Days' ? 'rgb(250, 204, 50)' : 'white',
            borderWidth: time === '30 Days' ? 0 : 1,
          }}
        >
          <Text style={{...styles.typeText, color: time === '30 Days' ? 'white' : 'rgb(60, 60, 60)'}}>
            30 Days
          </Text>
        </TouchableOpacity>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  container: {
    marginTop: Dimensions.get('window').height * 0.04,
    paddingLeft: Dimensions.get('window').width * 0.05,
    paddingRight: Dimensions.get('window').width * 0.05,
  },
  filter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  filterBox: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(250, 204, 50)',
    right: 0,
    height: 50,
    width: 50,
    marginTop: 0,
    borderRadius: 16,
    zIndex: 3,
    shadowOpacity: 0.5,
    shadowColor: 'rgba(181, 153, 38, 1)',
    shadowRadius: 16,
  },
  history: {
    display: 'flex',
    flexDirection: 'row',
  },
  options: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 60,
    paddingLeft: 25,
    right: 0,
    height: 70,
    width: 50,
    backgroundColor: 'rgb(250, 204, 50)',
    marginTop: 75,
    borderRadius: 16,
    zIndex: 0,
  },
  pad: {
    position: 'absolute',
    backgroundColor: 'rgb(240, 240, 245)',
    height: 90,
    marginTop: 0,
    width: Dimensions.get('window').width * 0.1,
    zIndex: 0,
    right: -Dimensions.get('window').width * 0.05,
  },
  searchbar: {
    width: Dimensions.get('window').width * 0.7,
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 20,
  },
  searchbarBox: {
    width: Dimensions.get('window').width * 0.7,
    height: 50,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 16,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  sortBy: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 7,
    marginRight: 5,
    borderWidth: 1,
  },
  time: {
    marginRight: 10,
  },
  timeBox: {
    marginTop: 170,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.9,
    height: 60,
    marginLeft: -Dimensions.get('window').width,
    opacity: 1,
    zIndex: 10,
    borderRadius: 14,
  },
  timeButton: {
    display: 'flex',
    height: 50,
    width: Dimensions.get('window').width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderColor: 'rgb(250, 204, 50)',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeText: {
    fontWeight: 'bold',
    fontSize: 13,
  }
});

export default Search;