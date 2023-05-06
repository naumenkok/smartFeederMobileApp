import React, {useEffect, useState} from 'react';
import { ImageBackground, View, StyleSheet, Text, } from 'react-native';
import BottomTab from '../components/BottomTab';
import axios from 'axios';
import Constants from 'expo-constants';

export default function MessageScreen ({ navigation }) {
    const [data, setData] = useState({ food: 0, water: 0, battery: 0 });

    const fetchData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const url = `http://${ipAddress}:8080/getSimStatus`
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
       
            <View style={[styles.container, styles.container1, styles.shadowProp]}>
                <Text style={[styles.text, styles.text1]}>The current state of the dog feeder </Text>
                <Text style={[styles.text, styles.text1]}>Food:</Text>
                <Text style={[styles.text, styles.text1]}>{data.food}</Text>
                <Text style={[styles.text, styles.text1]}>Water:</Text>
                <Text style={[styles.text, styles.text1]}>{data.water}</Text>
                <Text style={[styles.text, styles.text1]}>Battery:</Text>
                <Text style={[styles.text, styles.text1]}>{data.battery}</Text>
            </View>
            <View style={[styles.container, styles.container3, styles.shadowProp]}>
                <BottomTab navigation={navigation} screenType={'MessageScreen'}></BottomTab>
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
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
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
  });
  