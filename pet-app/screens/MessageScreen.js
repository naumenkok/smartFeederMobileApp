import React, {useEffect, useState, useRef} from 'react';
import {Animated, View, StyleSheet, ImageBackground, Easing, Text, Image,} from 'react-native';
import BottomTab from '../components/BottomTab';
import axios from 'axios';
import Constants from 'expo-constants';

export default function MessageScreen ({route, navigation }) {
    const [data, setData] = useState({ notifications: [] });
    const opacityValues = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
    const translationValues = useRef([...Array(4)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animations = [...Array(4)].map((_, index) =>
            Animated.parallel([
                Animated.timing(opacityValues[index], {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.timing(translationValues[index], {
                    toValue: -100,
                    useNativeDriver: true,
                })
            ])
        );
        Animated.stagger(350, animations).start();
    }, []);

    const fetchData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const url = `http://${ipAddress}:8080/getNotification?userID=${route.params.id}&limit=4`;
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 2000);
        return () => clearInterval(intervalId);
    }, []);

  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
        {data.notifications.map((notification, index) => (
            <Animated.View key={index} style={[styles.container, styles.container1, styles.shadowProp, {opacity: opacityValues[index], transform: [{ translateX: translationValues[index] }  ] }   ]}>
                <Text key={index} style={[styles.text, styles.text2]}>{index}{notification.context}</Text>
                <View style={[styles.img]}><Image source={require('./../img/Polygon.png')}/></View>
            </Animated.View>
        ))}

        {[...Array(4-data.notifications.length)].map((_, index) =>(
            <Animated.View  key={index} style={[styles.container, styles.container1, styles.container2]}>
            </Animated.View>
        ))}

        <View style={[styles.container, styles.container3, styles.shadowProp]}>
            <BottomTab navigation={navigation} screenType={'MessageScreen'} id={route.params.id }></BottomTab>
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
        alignItems: 'flex-end',
      },
    container: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        flex:14,
        marginTop: '18%',
        marginHorizontal: '10%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        paddingHorizontal: 5,
        minWidth: 100,
        left: 100,
    },
    container2:{ opacity: 1.0},
    container3: {
        flex: 8,
        marginVertical: '5%',
        marginTop: '15%',
    },
    shadowProp: {  
      shadowColor: 'rgb(86, 41, 246)',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2},
      shadowRadius: 10,
      elevation: 10,
    },
    text2: {
        color: 'blue',
        fontSize: 16,
        textAlign:'center',
        fontWeight: 'bold',
    },
    img: {
        top: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
  });
