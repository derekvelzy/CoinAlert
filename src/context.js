import React, { createContext, useState, useRef, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-community/google-signin';
import { googleWebClientID } from './../key.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setSearch } from './redux/search.js';
import { setAllCoins, setCoins, setSavedCoins, setSaved, sortData } from './redux/coins.js';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

GoogleSignin.configure({ webClientId: googleWebClientID });

export const Context = createContext(null);

const ConfigProvider = ({ children }) => {
  const { apiTime, sortMethod, allCoins, coins, savedCoins, saved } = useSelector(state => state.coin);
  const dispatch = useDispatch();

  const [user, setUser] = useState('');
  const [loginLoad, setLoginLoad] = useState(false);
  const [loginErr, setLoginErr] = useState(false);
  const [signupErr, setSignupErr] = useState(false);

  const update = () => {
    firestore().collection('Users').doc(user.email).collection('Saved').get()
      .then((q) => {
        let c = {};
        for (let i = 0; i < q._docs.length; i++) {
          c[q._docs[i]._data.coin] = [q._docs[i]._data.upper, q._docs[i]._data.lower];
        }
        dispatch(setSaved(c))
        axios.get('http://ec2-13-52-237-73.us-west-1.compute.amazonaws.com:8020/initial')
          .then((res) => dispatch(sortData({data: res.data, s: c})));
      })
  };

  const logout = async () => {
    try {
      dispatch(setSearch(''));
      await auth().signOut();
    } catch (e) {
      console.log('error logging out', e);
    }
  };

  const google = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      setLoginLoad(true);
      const data = await auth().signInWithCredential(googleCredential);
      const email = data.additionalUserInfo.profile.email;
      firestore().collection('Users').doc(email).set({email})
    } catch (e) {
      console.log('error signing in with google', e);
    }
  };

  const login = async (email, pass) => {
    try {
      setLoginErr(false);
      await auth().signInWithEmailAndPassword(email, pass);
      // setEmojiElements(emojiTable());
    } catch (e) {
      setLoginErr(true);
      console.log('error logging in', e);
    }
  };

  const signup = async (email, pass) => {
    try {
      setSignupErr(false);
      await auth().createUserWithEmailAndPassword(email, pass);
      firestore().collection('Users').doc(email).set({email})
      // setEmojiElements(emojiTable());
    } catch (e) {
      setSignupErr(true);
      console.log('error signing up', e);
    }
  };

  const guest = async () => {
    try {
      auth().signInAnonymously();
    } catch (e) {
      console.log('error signing in anonymously', e);
    }
  }

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logout,
        google,
        login,
        signup,
        guest,
        update,
        loginLoad,
        setLoginLoad,
        loginErr,
        setLoginErr,
        signupErr,
        setSignupErr
      }}>
      {children}
    </Context.Provider>
  );
};

export default ConfigProvider;
