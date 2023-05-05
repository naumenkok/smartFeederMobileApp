import React from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import BottomTab from '../components/BottomTab';

export default function MessegeScreen ({ navigation }) {
  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
       
            <View style={[styles.container, styles.container1, styles.shadowProp]}>
            </View>
            <View style={[styles.container, styles.container3, styles.shadowProp]}>
                <BottomTab navigation={navigation} screenType={'MessegeScreen'}></BottomTab>
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
        //padding: 60,
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        flex:75,
        marginTop: '25%',
        marginBottom: '10%',
    },
    container3: {
        flex: 8,
        marginVertical: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shadowProp: {  
      shadowColor: 'rgb(86, 41, 246)',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2},
      shadowRadius: 10,
      elevation: 10,
    }, 
  });
  