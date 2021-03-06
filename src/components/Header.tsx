import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import avatarImg from '../assets/cassio.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [ userName, setUserName ] = useState('');

  useEffect(() => {
    async function loadStorageUserName() {
      const user = await AsyncStorage.getItem('@PlantManager:user');
      setUserName(user || '');
    }

    loadStorageUserName();
  }, [userName]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <Image source={avatarImg} style={styles.avatar} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40
  }
})