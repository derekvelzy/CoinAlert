import React, { useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../context.js';

const Header = () => {
  const { logout } = useContext(Context);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Icon name="sign-out" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Coin Alert</Text>
        <View style={styles.filler} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.12,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: Dimensions.get('window').width * 0.05,
    paddingRight: Dimensions.get('window').width * 0.05,
  },
  content: {
    height: Dimensions.get('window').height * 0.07,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.9,
  },
  filler: {
    width: Dimensions.get('window').height * 0.055
  },
  logout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(250, 204, 50)',
    height: Dimensions.get('window').height * 0.055,
    width: Dimensions.get('window').height * 0.055,
    marginTop: 0,
    borderRadius: 16,
    zIndex: 3,
    shadowOpacity: 0.5,
    shadowColor: 'rgba(181, 153, 38, 1)',
    shadowRadius: 16,
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
  }
});

export default Header;