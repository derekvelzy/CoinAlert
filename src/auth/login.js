import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { Context } from '../context.js';
import { GoogleSigninButton } from '@react-native-community/google-signin';

const Login = () => {
  const {
    google, loginLoad, guest, login, signup, loginErr, setLoginErr, signupErr, setSignupErr
  } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [type, setType] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  const handleLoginBut = () => {
    setLoginErr(false);
    setSignupErr(false);
    setEmailErr(false);
    if (type) {
      setType(false);
    } else {
      login(email, password)
    }
  };

  const handleSignupBut = () => {
    setLoginErr(false);
    setSignupErr(false);
    setEmailErr(false);
    if (!type) {
      setType(true);
    } else if (password === checkPassword && password.length > 4 && email !== '') {
      signup(email, password);
    } else if (email === '') {
      setEmailErr(true);
    } else {
      setSignupErr(true);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CryptoLimits</Text>
      <View style={styles.form}>
        {loginErr ? <Text style={styles.err}>Email or password incorrect</Text> : <View />}
        {signupErr ? <Text style={styles.err}>Passwords must be equal and at least 5 characters long</Text> : <View />}
        {emailErr ? <Text style={styles.err}>Must enter valid email</Text> : <View />}
        <TextInput
          placeholder="Email"
          placeholderTextColor="rgb(170, 170, 170)"
          value={email}
          style={styles.input}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="rgb(170, 170, 170)"
          value={password}
          style={styles.input}
          onChangeText={(e) => setPassword(e)}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Re-Enter Password"
          placeholderTextColor="rgb(170, 170, 170)"
          value={checkPassword}
          style={{...styles.input, display: type ? 'flex' : 'none'}}
          onChangeText={(e) => setCheckPassword(e)}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={{
              ...styles.type,
              backgroundColor: type ? 'rgb(230, 230, 230)' : 'rgb(0, 0, 0)',
              marginRight: 25
            }}
            onPress={handleLoginBut}
          >
            <Text style={{...styles.typeText, color: type ? 'black' : 'white' }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.type,
              backgroundColor: type ? 'rgb(0, 0, 0)' : 'rgb(230, 230, 230)',
            }}
            onPress={handleSignupBut}
          >
            <Text style={{...styles.typeText, color: type ? 'white' : 'black'}}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.guest} onPress={guest}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>
      <View style={{ width: Dimensions.get('window').width * 0.7}}>
        <Text style={styles.description}>
          Get real-time data and set upper and lower price limits on the top 30 most popular Cryptocurrencies
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(222, 169, 22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  err: {
    color: 'red',
    textAlign: 'center'
  },
  form: {
    alignItems: 'center',
    width: 305
  },
  input: {
    backgroundColor: 'white',
    width: 305,
    height: 40,
    borderRadius: 4,
    shadowOffset: { height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 30,
    fontFamily: 'Avenir-Medium',
  },
  guest: {
    backgroundColor: 'rgb(230, 230, 230)',
    height: 40,
    width: 305,
    shadowOffset: { height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  guestText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 17,
  },
  title: {
    fontFamily: 'Avenir-MediumOblique',
    marginBottom: 20,
    color: 'white',
    fontSize: 40
  },
  type: {
    height: 40,
    width: 140,
    shadowOffset: { height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  typeText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 17,
  }
});

export default Login;