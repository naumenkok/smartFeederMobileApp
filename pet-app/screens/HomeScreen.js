import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import { Animated } from 'react-native';
import BottomTab from '../components/BottomTab';
import axios from 'axios';
import { NetworkInfo } from 'react-native-network-info';

export default function HomeScreen ({ navigation }) {

  const [data, setData] = useState('');

  //var NetworkInfo = require('react-native-network-info');
  
  // NetworkInfo.getIPV4Address().then(ipv4Address => {
  //   // console.log(ipv4Address);
  // });

  const fetchData = async () => {
    try {
      //const ipAddress = await NetworkInfo.getIPV4Address();
      const response = await axios.get('http://172.20.10.9:8080/getSimStatus');
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
            {/* <TouchableOpacity onPress={fetchData}>
              <Text>Refresh</Text>
            </TouchableOpacity>
            <Text>{data.water}</Text>
            <Text>{data.food}</Text> */}

            <View style={[styles.container, styles.container1, styles.shadowProp]}>
                    
            
            </View>
            <View style={[styles.container, styles.container2, styles.shadowProp]}>
              <Text style={[styles.text, styles.text1]}>Food:</Text>
              <Text style={[styles.text, styles.text1]}>{data.food}</Text>
              <Text style={[styles.text, styles.text1]}>Water:</Text>
              <Text style={[styles.text, styles.text1]}>{data.water}</Text>
            </View>
            <View style={[styles.container, styles.container3, styles.shadowProp]}>
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
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        flex: 10,
        marginBottom: '5%',
        marginTop: '25%',
    },
    container2: {
        flex: 65,
        marginBottom: '5%',
        marginTop: '5%',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    container3: {
        flex: 8,
        marginVertical: '5%',
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
    shadowProp: {  
      shadowColor: 'rgb(86, 41, 246)',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2},
      shadowRadius: 10,
      elevation: 10,
    }, 
  });
  