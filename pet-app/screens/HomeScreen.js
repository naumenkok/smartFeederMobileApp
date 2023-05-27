import React from 'react';
import { useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, Image, PanResponder} from 'react-native';
import BottomTab from '../components/BottomTab';
import DateTab from '../components/DateTab';
import axios from 'axios';
import Constants from 'expo-constants';


export default function HomeScreen ({ navigation }) {

    const [history, setHistory] = useState({ times: [], amounts: [] });
    const [amount, setAmount] = useState({message: 0});
    const [today, setToday] = useState(new Date());
    const [panResponder, setPanResponder] = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 50) {
                    navigation.navigate('HistoryScreen');
                }
            },
        })
    );

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
            const historyResponse = await axios.get(`http://${ipAddress}:8080/getEatHistoryInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`}
            });
            setHistory(historyResponse.data);

            const amountResponse = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`}
            });
            setAmount(amountResponse.data);
        }  catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 2000);
        return () => clearInterval(intervalId);
    }, [today]);

  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground} {...panResponder.panHandlers}>
            <DateTab
                myMarginTop={ '25%'}
                today={today}
                setToday={setToday}
                getBefYesterday={getBefYesterday}
                getYesterday={getYesterday}
                getTomorrow={getTomorrow}
                getAftTomorrow={getAftTomorrow}
            />
            <View style={[styles.container, styles.container2, styles.shadowProp]}>
                {history.times.map((time, index) => (
                    <View  key={index} style={styles.container4}>
                        <Text style={[styles.text, styles.text1, { textAlign: 'center' }]}>
                            {time}{'    '}
                        </Text>
                        <Text style={[styles.text, styles.text2, { textAlign: 'center' }]}>
                            Meal {index}:    {history.amounts[index]}{'        '}
                        </Text>
                        <Image source={require('./../img/Ok.png')} style={[styles.img]}/>
                    </View>
                ))}
                {amount.message !== null && amount.message !== 0 ? (
                    <Text style={[styles.text, styles.text3, {textAlign: 'center'}]}>
                        Eaten in this day: {amount.message}
                    </Text>
                ) : (
                    <Text style={[styles.text, styles.text3, {textAlign: 'center'}]}>
                        Nothing was eaten
                    </Text>
                )}
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
    text3: {
        fontSize: 20,
        color: 'rgb(250, 123, 205)',
        paddingTop: 15,
    },
    shadowProp: {  
      shadowColor: 'rgb(86, 41, 246)',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2},
      shadowRadius: 10,
      elevation: 10,
    },
    img: { marginTop: 7,},
  });
  