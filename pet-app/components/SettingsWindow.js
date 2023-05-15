import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {View, ImageBackground, Modal, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import Constants from 'expo-constants';

export default function SettingsWindow({ visible, onClose }) {

    const [data, setData] = useState({times: [], amounts: []} );

    const fetchData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const response = await axios.get(`http://${ipAddress}:8080/getCurrentDiet`);
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
        <Modal visible={visible} animationType='slide'>
            <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>


                <View style={[styles.container, styles.shadowProp]}>
                    <Text style={[styles.text, styles.text1]}>Current diet:</Text>
                    {data.times.map((time, index) => (
                        <View  key={index} style={styles.container4}>
                            <Text style={[styles.text, styles.text2, { textAlign: 'center' }]}>
                                Meal {index}:{' '}{time}{' - '}{data.amounts[index]}
                            </Text>
                        </View>
                    ))}

                    <TouchableOpacity onPress={onClose}>
                        <Text style={[styles.text, styles.text3]}>Close</Text>
                    </TouchableOpacity>
                </View>



            </ImageBackground>
        </Modal>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        opacity: 0.7,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 20,
        width: '80%',
        height: '50%',
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
        marginBottom: '5%',
        marginTop: '5%',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    container4:{
        paddingHorizontal: 40,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontWeight: 'bold',
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
        fontSize: 16,
        color: 'blue',
    },
    shadowProp: {
        shadowColor: 'rgb(86, 41, 246)',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 10,
    },
});
