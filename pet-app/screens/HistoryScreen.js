import React from 'react';
import { useState, useEffect } from 'react';
import {ImageBackground, View, StyleSheet, Text, Image, PanResponder} from 'react-native';
import BottomTab from '../components/BottomTab';
import DateTab from '../components/DateTab';
import axios from 'axios';
import Constants from 'expo-constants';
import {LinearGradient} from 'expo-linear-gradient';


export default function HomeScreen ({route, navigation }) {
    const [amounts, setAmounts] = useState(Array(9).fill(0));
    const [today, setToday] = useState(new Date(route.params.today));
    const maxHeight = 450;
    const [maxAmount, setMaxAmount] = useState(1);
    const [panResponder, setPanResponder] = useState(null);

    useEffect(() => {
        setPanResponder(
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderRelease: (e, gestureState) => {
                    if (gestureState.dx > 30) {
                        const currentDate = new Date(today.getTime());
                        currentDate.setDate(currentDate.getDate() - 1);
                        setToday(currentDate);
                        console.log('dziala')
                        //navigation.navigate('HomeScreen', { id:route.params.id , today:today.toISOString() });
                    }
                    if (gestureState.dx < -30) {
                        const currentDate = new Date(today.getTime());
                        currentDate.setDate(currentDate.getDate() + 1);
                        setToday(currentDate);
                        console.log('dziala')
                        //navigation.navigate('HomeScreen', { id:route.params.id , today:today.toISOString() });
                    }
                },
            })
        );
    },[today]);

    const fetchData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const myAmounts = [];
            for (let day = 4; day >= -4; day--) {
                const amount = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                    params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()+day).toString().padStart(2, '0')}`}
                });
                myAmounts.push(amount.data.message);
            }
            setAmounts(myAmounts);
        }  catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setMaxAmount(Math.max(...amounts));
    }, [amounts]);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 2000);
        return () => clearInterval(intervalId);
    }, [today]);

    const getHeight = (amount) => {
        if (maxAmount === 0) {
            return 5;
        }
        return maxHeight*amount/maxAmount+5;
    };

    return (
        <ImageBackground source={require('./../img/background.jpg')} style={styles().imageBackground} {...panResponder?.panHandlers}>
            <View style={[styles().container, styles().container2, styles().shadowProp]}>
                <View>
                    {amounts.some((amount) => {return amount !== null && amount !== 0})? (
                        <Text style={[styles().text, {bottom: 25}]}>
                            History diagram:
                        </Text>
                    ) : (
                        <Text style={[styles().text, {bottom: 30}]}>
                            Nothing was eaten!!!
                        </Text>
                    )}
                </View>
                <View style={styles().container4}>
                    {amounts.map((amount, index) => (
                        <LinearGradient
                            colors={['rgb(250, 186, 171)', 'rgb(250, 123, 205)', 'rgb(126, 94, 240)']}
                            style={[styles().column, styles(getHeight(amount))[`column${(today.getDate()+index) % 5}`]]}
                            key={index}
                        >
                        </LinearGradient>
                    ))}
                    <View style={[styles().column, styles().column5]}>
                        <Text style={styles().labelText}>{maxAmount}</Text>
                        <Text style={styles().labelText}>{maxAmount/2}</Text>
                        <Text style={[styles().labelText, {height: 15, bottom: 10}]}>{0}</Text>
                    </View>
                </View>
                <DateTab
                    myMarginTop={ '10%'}
                    isHistory = {true}
                    today={today}
                    setToday={setToday}
                />
            </View>
            <View style={[styles().container, styles().container3, styles().shadowProp]}>
                <BottomTab navigation={navigation} screenType={'HomeScreen'} id={route.params.id}></BottomTab>
            </View>
        </ImageBackground>
    );
}

const styles = (myHeight = 40) => StyleSheet.create({
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
        flex: 85,
        marginTop: '15%',
        marginBottom: '5%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    container3: {
        flex: 8,
        marginVertical: '5%',
    },
    container4:{
        paddingHorizontal: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    column: {width: '9%', height: 10, borderRadius: 22,},
    column1: { height: myHeight },
    column2: { height: myHeight },
    column3: { height: myHeight },
    column4: { height: myHeight },
    column0: { height: myHeight },
    column5: {width: '7%', height: 450, flexDirection: 'column', justifyContent: 'space-around'},
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'rgb(126, 94, 240)',
        paddingTop: 15,
        textAlign: 'center'
    },
    labelText:{
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        color: 'blue',
        height: 235,
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
