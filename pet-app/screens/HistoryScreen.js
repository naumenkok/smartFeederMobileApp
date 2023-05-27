import React from 'react';
import { useState, useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Text, Image } from 'react-native';
import BottomTab from '../components/BottomTab';
import DateTab from '../components/DateTab';
import axios from 'axios';
import Constants from 'expo-constants';


export default function HomeScreen ({navigation }) {
    const [amounts, setAmounts] = useState(Array(5).fill(0));
    const [today, setToday] = useState(new Date());

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

    const getHeight = (amount) => {
        let myHeight = amount*3+10;
        return myHeight;
    };

    const fetchData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const amountAftTomorrow = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()+2).toString().padStart(2, '0')}`}
            });
            const amountTomorrow = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()+1).toString().padStart(2, '0')}`}
            });
            const amountToday = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`}
            });
            const amountYesterday = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()-1).toString().padStart(2, '0')}`}
            });
            const amountBefYesterday = await axios.get(`http://${ipAddress}:8080/getAmountInDate`, {
                params: {date: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()-2).toString().padStart(2, '0')}`}
            });
            setAmounts([
                amountAftTomorrow.data.message,
                amountTomorrow.data.message,
                amountToday.data.message,
                amountYesterday.data.message,
                amountBefYesterday.data.message
            ]);
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
        <ImageBackground source={require('./../img/background.jpg')} style={styles().imageBackground}>
            <View style={[styles().container, styles().container2, styles().shadowProp]}>
                <View style={styles().container4}>
                    {amounts.map((amount, index) => (
                        <View style={[styles().column, styles(getHeight(amount))[`column${(today.getDate()+index) % 5}`]]}>
                            {/*<Text>getHeight(amount)</Text>*/}
                        </View>
                    ))}
                    <View style={[styles().column, styles().column5]}>
                    </View>
                </View>

                <View>
                    {amounts.some((amount) => {return amount !== null && amount !== 0})? (
                        <Text style={[styles().text, styles().text3, {textAlign: 'center'}]}>
                            History diagram:
                        </Text>
                    ) : (
                        <Text style={[styles().text, styles().text3, {textAlign: 'center'}]}>
                            Nothing was eaten!!!
                        </Text>
                    )}
                </View>
            </View>
            <DateTab
                myMarginTop={ '0%'}
                today={today}
                setToday={setToday}
                getBefYesterday={getBefYesterday}
                getYesterday={getYesterday}
                getTomorrow={getTomorrow}
                getAftTomorrow={getAftTomorrow}
            />
            <View style={[styles().container, styles().container3, styles().shadowProp]}>
                <BottomTab navigation={navigation} screenType={'HomeScreen'}></BottomTab>
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
        flex: 75,
        marginTop: '15%',
        marginBottom: '7%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 15,
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
    column: {width: '15%', height: 10, borderRadius: 22,},
    column1: { height: myHeight, backgroundColor: 'rgb(250, 186, 171)'},
    column2: { height: myHeight, backgroundColor: 'rgb(247, 159, 201)'},
    column3: { height: myHeight, backgroundColor: 'rgb(250, 123, 205)'},
    column4: { height: myHeight, backgroundColor: 'rgb(101, 152, 236)'},
    column0: { height: myHeight, backgroundColor: 'rgb(126, 94, 240)'},
    column5: {width: '10%'},
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
