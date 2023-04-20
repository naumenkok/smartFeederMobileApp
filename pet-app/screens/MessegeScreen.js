import React from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import BottomTab from '../components/BottomTab';

export default function MessegeScreen ({ navigation }) {
  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
       
            <View style={[styles.container, styles.container1]}>
            </View>
            {/* <View style={[styles.container, styles.container3]}>
                <BottomTab navigation={navigation} screenType={'MessegeScreen'}></BottomTab>
            </View> */}
            <View style={[styles.container, styles.container3]}>
            <TouchableOpacity 
                        onPress={() => navigation.navigate('HomeScreen')}
                        style={styles.button}>
                        <Image source={require('./../img/Home.png')} style={styles.image}/>
            </TouchableOpacity>
            <Image source={require('./../img/MessegeMain.png')} style={styles.image3}/>
            <TouchableOpacity 
                        onPress={() => navigation.navigate('UserScreen')}
                        style={styles.button}>
                        <Image source={require('./../img/User.png')} style={styles.image2}/>
            </TouchableOpacity>
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
        paddingVertical: '75%',
        marginBottom: '5%',
        marginTop: '10%',
    },
    container2: {
        paddingVertical: '60%',
        marginBottom: '10%',
        marginTop: '5%',

    },
    container3: {
        padding: '8%',
        marginBottom: '10%',
        marginTop: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    container1: {
      //padding: '10%',
      //marginBottom: '10%',
      marginTop: '25%',


      paddingVertical: '75%',
      marginBottom: '10%',
  },
  // container2: {
  //     paddingVertical: '60%',
  //     marginBottom: '10%',
  //     marginTop: '5%',
  // },
  container3: {
      padding: '8%',
      marginVertical: '10%',
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
    image: {
        bottom: 20,
    },
    image2: {
        bottom: 15,
    },
    image3:{
        bottom: 60,
        right: 5,
    },
  });
  