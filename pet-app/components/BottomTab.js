import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default function BottomTab({navigation, screenType}) {
    imgHomeSource = require('./../img/Home.png')
    imgMessegeSource = require('./../img/Messege.png')
    imgUserSource = require('./../img/User.png')
    if (screenType === 'HomeScreen'){
        imgHomeSource = require('./../img/HomeMain.png')
    } else if (screenType === 'MessegeScreen'){
        imgMessegeSource = require('./../img/MessegeMain.png')
    } else if (screenType === 'UserScreen'){
        imgUserSource = require('./../img/UserMain.png')
    }
    return (
    <>
    <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.button}>
          <Image source={imgHomeSource} style={styles.image} />
    </TouchableOpacity>
    <TouchableOpacity
          onPress={() => navigation.navigate('MessegeScreen')}
          style={styles.button}>
          <Image source={imgMessegeSource} style={styles.image} />
    </TouchableOpacity>
    <TouchableOpacity
          onPress={() => navigation.navigate('UserScreen')}
          style={styles.button}>
              <Image source={imgUserSource} style={styles.image} />
    </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
    image: {
        bottom: 15,
        right: 25,
    },
    image2:{
        bottom: 15,
        right: 5,
    },
    image3:{
        bottom: 60,
        right: 20,
    }
  });