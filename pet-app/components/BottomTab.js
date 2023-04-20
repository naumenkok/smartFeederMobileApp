import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export default function BottomTab({navigation, screenType}) {
    // const animation = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     Animated.timing(animation, {
    //         toValue: 4,
    //         duration: 375,
    //         useNativeDriver: true
    //     }).start();
    // }, []);

    // const interpolatedRotateAnimation = animation.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ['0deg', '360deg']
    // });


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
    <View style={styles.container}>
        <TouchableOpacity
            onPress={() => navigation.navigate('HomeScreen')}
            // onPress={screenType === 'HomeScreen' ?() => null : navigation.navigate('HomeScreen')}
            style={styles.button}>
            <Image source={imgHomeSource} style={[
                screenType === 'HomeScreen' && { bottom: 60, right: 20, },
                screenType === 'MessegeScreen' && { bottom: 20, },
                screenType === 'UserScreen' && { bottom: 20, left: 5, }]} />
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('MessegeScreen')}
            style={styles.button}>
            <Image source={imgMessegeSource} style={[
                screenType === 'HomeScreen' && { bottom: 15,right: 25, },
                screenType === 'MessegeScreen' && { bottom: 60, right: 5, },
                screenType === 'UserScreen' && { bottom: 15, left: 25,}]} />
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('UserScreen')}
            style={styles.button}>
            <Image source={imgUserSource} style={[
                screenType === 'HomeScreen' && { bottom: 15,right: 5, },
                screenType === 'MessegeScreen' && { bottom: 15, },
                screenType === 'UserScreen' && { bottom: 60, left: 20,}]} />
        </TouchableOpacity>
    </View> 
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
  });