import React from 'react';
import { useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import BottomTab from '../components/BottomTab';
import axios from 'axios';
import Constants from 'expo-constants';

export default function HomeScreen ({ navigation }) {

    const [data, setData] = useState({ times: [], amounts: [] });
    const [today, setToday] = useState(new Date());

    //let today = new Date();
    const getYesterday = () => {
        let d = new Date(today.getTime());
        d.setDate(d.getDate() - 1);
        return new Date(d);
    };

    const getBefYesterday = () => {
        let d = getYesterday();
        d.setDate(d.getDate() - 1);
        return new Date(d);
    };

    const getTomorrow = () => {
        let d = new Date(today.getTime());
        d.setDate(d.getDate() + 1);
        return new Date(d);
    };

    const getAftTomorrow = () => {
        let d = getTomorrow();
        d.setDate(d.getDate() + 1);
        return new Date(d);
    };

    const fetchData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const response = await axios.get(`http://${ipAddress}:8080/getEatHistoryInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`}
            });
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 2000);
        return () => clearInterval(intervalId);
    }, [today]);

  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
            <View style={[styles.container, styles.container1, styles.shadowProp]}>
                <TouchableOpacity
                    onPress={() => setToday(getBefYesterday())}
                    style={[styles.button, styles[`button${getBefYesterday().getDate() % 5}`]]}>
                    <Text style={styles.buttonText1}>{getBefYesterday().getDate()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setToday(getYesterday())}
                    style={[styles.button, styles[`button${getYesterday().getDate() % 5}`]]}>
                    <Text style={styles.buttonText1}>{getYesterday().getDate()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles[`button${today.getDate() % 5}`], styles.buttoncenter, styles.shadowProp]}>
                    <Text style={styles.buttonText1}>{today.getDate()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setToday(getTomorrow())}
                    style={[styles.button, styles[`button${getTomorrow().getDate() % 5}`]]}>
                    <Text style={styles.buttonText1}>{getTomorrow().getDate()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setToday(getAftTomorrow())}
                    style={[styles.button, styles[`button${getAftTomorrow().getDate() % 5}`]]}>
                    <Text style={styles.buttonText1}>{getAftTomorrow().getDate()}</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.container, styles.container2, styles.shadowProp]}>
                {data.times.map((time, index) => (
                    <View  key={index} style={styles.container4}>
                        <Text style={[styles.text, styles.text1, { textAlign: 'center' }]}>
                            {time}{'    '}
                        </Text>
                        <Text style={[styles.text, styles.text2, { textAlign: 'center' }]}>
                            Meal {index}:    {data.amounts[index]}{'        '}
                        </Text>
                        <Image source={require('./../img/Ok.png')} style={[styles.img]}/>
                    </View>
                ))}
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
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        flex: 10,
        marginBottom: '5%',
        marginTop: '25%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container2: {
        flex: 65,
        marginBottom: '5%',
        marginTop: '5%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    container3: {
        flex: 8,
        marginVertical: '5%',
    },
    container4:{
        paddingHorizontal: 40,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
      fontWeight: 'bold',
      color: "white",
      textAlign: 'center',
    },
    text1: {
        fontSize: 24,
        color: 'rgb(126, 94, 240)',
    },
    text2: {
        fontSize: 20,
        color: 'rgb(101, 152, 236)',
        paddingTop: 3,
    },
    shadowProp: {  
      shadowColor: 'rgb(86, 41, 246)',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2},
      shadowRadius: 10,
      elevation: 10,
    },
    img: { marginTop: 7,},
    polygon: { opacity: 0.7, bottom: 23, left: 140, width: 90, height: 23,},
    button: {
        flexDirection: 'row',
        height: '87%',
        width: '19%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 22,
        opacity: 0.6,
    },
    button1: { backgroundColor: 'rgb(126, 94, 240)'},
    button2: { backgroundColor: 'rgb(101, 152, 236)'},
    button3: { backgroundColor: 'rgb(250, 123, 205)'},
    button4: { backgroundColor: 'rgb(247, 159, 201)'},
    button0: { backgroundColor: 'rgb(250, 186, 171)'},
    buttoncenter: { top: 10, height: '95%', width: '20%', opacity: 1,},
    buttonText1: {
        fontSize: 34,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
    },
  });
  