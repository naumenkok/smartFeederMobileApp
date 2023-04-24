import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import { Animated } from 'react-native';
import BottomTab from '../components/BottomTab';

export default function HomeScreen ({ navigation }) {

  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
       
            <View style={[styles.container, styles.container1]}>
                    
            </View>
            <View style={[styles.container, styles.container2]}>
                    
            </View>
            <View style={[styles.container, styles.container3]}>
                <BottomTab navigation={navigation} screenType={'HomeScreen'}></BottomTab>
            </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    imageBackground: {
        opacity: 0.7,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      },
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 60,
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        padding: '10%',
        marginBottom: '5%',
        marginTop: '25%',
    },
    container2: {
        paddingVertical: '60%',
        marginBottom: '10%',
        marginTop: '5%',
    },
    container3: {
        padding: '8%',
        marginVertical: '10%',
    },
  });
  