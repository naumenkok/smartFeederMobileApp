import React from 'react';
import { useRef, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import { Animated } from 'react-native';

export default function UserScreen ({ navigation }) {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 4,
            duration: 250,
            useNativeDriver: true
        }).start();
    }, []);

    const interpolatedRotateAnimation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    
  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
       
            <View style={[styles.container, styles.container1]}>
                    
            </View>
            <View style={[styles.container, styles.container2]}>
                    
            </View>
            <View style={[styles.container, styles.container3]}>
                <TouchableOpacity 
                            onPress={() => navigation.navigate('HomeScreen')}
                            style={styles.button}>
                            <Image source={require('./../img/Home.png')} style={styles.image2}/>
                </TouchableOpacity>
                <TouchableOpacity 
                            onPress={() => navigation.navigate('MessegeScreen')}
                            style={styles.button}>
                            <Image source={require('./../img/Messege.png')} style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                                    Animated.timing(animation, {
                                        toValue: 0,
                                        duration: 1000,
                                        useNativeDriver: true
                                    }).start();
                                }}>
                                    <Animated.Image
                                        style={[styles.image3, { transform: [{ rotate: interpolatedRotateAnimation }] }]}
                                        source={require('./../img/UserMain.png')}
                                    />
                </TouchableOpacity>
                {/* <Image source={require('./../img/UserMain.png')} style={[styles.image3, { transform: [{ rotate: interpolatedRotateAnimation }] }]}/> */}
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
        padding: '20%',
        marginBottom: '10%',
        marginTop: '20%',
    },
    container2: {
        paddingVertical: '50%',
        marginBottom: '10%',
        marginTop: '5%',

    },
    container3: {
        padding: '8%',
        marginVertical: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        bottom: 15,
        left: 25,
    },
    image2:{
        bottom: 20,
        left: 5,
    },
    image3:{
        bottom: 60,
        left: 20,
    }
  });
  