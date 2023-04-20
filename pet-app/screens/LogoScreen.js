import React from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';


export default function LogoScreen ({ navigation }) {
  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
       
            <View style={styles.container1}>
                    <Text style={styles.text1}>Welcome to KarmiX</Text>
                    <Image source={require('./../img/Logo.png')} style={styles.image}/>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('HomeScreen')}
                        style={styles.button}>
                        <Text style={styles.buttonText1}>let's start</Text>
                    </TouchableOpacity>
            </View>
       
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    imageBackground: {
        opacity: 0.7,
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
      },
    container1: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 50,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    text1: {
        opacity: 1,
        fontSize: 35,
        fontWeight: 'bold',
        color: "white",
        textAlign: 'center',
        // fontFamily: 'AlBayan',
    },
    button: {
        flexDirection: 'row',
        height: 60,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 25,
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 22,
    },
    buttonText1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
    },
    image:{left: 10,
    }
  });
  