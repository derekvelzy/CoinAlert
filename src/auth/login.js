import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from 'react-native';
import { Context } from '../context.js';
import { GoogleSigninButton } from '@react-native-community/google-signin';
// import AnimatedLoader from "react-native-animated-loader";

const Login = () => {
  const { google, loginLoad } = useContext(Context);

  return (
    <View style={styles.container}>
      {/* <AnimatedLoader
          visible={loginLoad}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("../loader/8195-loader-aniation.json")}
          animationStyle={styles.lottie}
          speed={1}
        /> */}
      <GoogleSigninButton
          onPress={() => google()}
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 245)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    height: 130,
  },
});

export default Login;