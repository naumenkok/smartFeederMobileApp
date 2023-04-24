import React from 'react';
import { useRef, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import { Animated } from 'react-native';
import BottomTab from '../components/BottomTab';
import { useState } from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';


export default function UserScreen ({ navigation }) {
  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
       
        <View style={[styles.container, styles.container1]}>
            <Image source={require('./../img/Avatar.png')} style={styles.user}/>
            <Text style={[styles.text, styles.text]} >Hi Ala Makota!</Text>
        </View>
        <View style={[styles.container, styles.container2]}>
            <TouchableOpacity 
                    onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={[styles.text, styles.text1]} >CHANGE YOUR PROFILE</Text>
            </TouchableOpacity>
            <Image source={require('./../img/Line3.png')} style={styles.arrow} />
            <TouchableOpacity 
                    onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={[styles.text, styles.text2]} >VIEW HISTORY</Text>
            </TouchableOpacity>
            <Image source={require('./../img/Line2.png')} style={styles.arrow} />
            <TouchableOpacity 
                    onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={[styles.text, styles.text3]} >FOOD SETTINGS</Text>
            </TouchableOpacity>
            <Image source={require('./../img/Line1.png')} style={styles.arrow} />
            <TouchableOpacity 
                    onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={[styles.text, styles.text4]} >VIEW RECOMENDATION</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.container, styles.container3]}>
            <BottomTab navigation={navigation} screenType={'UserScreen'}></BottomTab>
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
        height: '100%'
      },
    container: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        flex: 30,
        marginBottom: '2%',
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    container2: {
        flex: 50,
        flexDirection: 'column',
        alignContent: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        marginBottom: '5%',
    },
    container3: {
        flex: 8,
        marginVertical: '5%',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: "white",
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    text1: {
        color: 'rgb(126, 94, 240)',
    },
    text2: {
        color: 'rgb(101, 152, 236)',
    },
    text3: {
        color: 'rgb(250, 123, 205)',
    },
    text4: {
        color: 'rgb(250, 186, 171)',
    },
    arrow: {
        left: 120,
        height: 5,
        width: 130,
    },
    user: {
        height: 145,
        width: 145,
    },
  });
  