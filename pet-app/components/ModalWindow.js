import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    View,
    ImageBackground,
    Modal,
    StyleSheet,
    Button,
    TouchableOpacity,
    Text,
    TextInput,
    Keyboard
} from 'react-native';
import Constants from 'expo-constants';

export default function ModalWindow({ visible, onClose }) {

    const [data, setData] = useState('');
    const [times, setTimes] = useState(Array(5).fill(''));
    const [amounts, setAmounts] = useState(Array(5).fill(''));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const isError = times.some((time) => {
            const [hours, minutes] = time.split(':');
            return parseInt(hours) < 0 || parseInt(hours) > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59;
        }) || amounts.some((amount) => {
            return parseInt(amount) < 0 || parseInt(amount) > 200 ;
        });
        setHasError(isError);
    }, [times, amounts]);

    const postData = async () => {
      try {
        const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
        const response = await axios.post(`http://${ipAddress}:8080/postNewDiet`,  {
            times: times,
            amounts: amounts
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const onCloseModal = () => {
        setTimes(Array(5).fill(''));
        setAmounts(Array(5).fill(''));
        onClose();
    };

  return (
    <Modal visible={visible} animationType='slide'>
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
        <View style={[styles.container, styles.shadowProp]}>
            <Text style={[styles.text, styles.text1]}>Change diet:</Text>
            {[...Array(5)].map((_, index) =>(
                <View  key={index} style={styles.container4}>
                    <Text style={[styles.text, styles.text2, { textAlign: 'center' }]}>
                        Meal {index}:
                    </Text>
                    <TextInput style={[styles.text, styles.text2, { textAlign: 'center' }]}
                               maxLength={2}
                               keyboardType="numeric"
                               returnKeyType="done"
                               onSubmitEditing={() => Keyboard.dismiss()}
                               onChangeText={(hours) => {
                                   const newTime = times[index].split(':')[1] || '00';
                                   const newTimeString = `${hours}:${newTime}`;
                                   const newTimes = [...times];
                                   newTimes[index] = newTimeString;
                                   setTimes(newTimes);
                               }}
                               value={times[index].split(':')[0] || ''}
                               placeholder="Hours"

                    />
                    <Text style={[styles.text, styles.text2, { textAlign: 'center' }]}>
                       :
                    </Text>
                    <TextInput style={[styles.text, styles.text2, { textAlign: 'center' }]}
                               maxLength={2}
                               keyboardType="numeric"
                               returnKeyType="done"
                               onSubmitEditing={() => Keyboard.dismiss()}
                               onChangeText={(minutes) => {
                                   const newTime = times[index].split(':')[0] || '00';
                                   const newTimeString = `${newTime}:${minutes}`;
                                   const newTimes = [...times];
                                   newTimes[index] = newTimeString;
                                   setTimes(newTimes);
                               }}
                               value={times[index].split(':')[1] || ''}
                               placeholder="Minutes"
                    />

                    <TextInput style={[styles.text, styles.text2]}
                               maxLength={3}
                               keyboardType="numeric"
                               returnKeyType="done"
                               onSubmitEditing={() => Keyboard.dismiss()}
                               onChangeText={amount => {
                                   const newAmount = amount.replace(/[^0-9]/g, '');
                                   if (newAmount.length <= 3) {
                                       const newAmounts = [...amounts];
                                       newAmounts[index] = newAmount;
                                       setAmounts(newAmounts);
                                   }
                               }}
                               value={amounts[index]}
                               placeholder="Amount"
                    />
                </View>
            ))}
            {hasError && <Text style={[styles.text, styles.text1]}>Wrong input data!</Text>}
            <View style={styles.container4}>
            <TouchableOpacity onPress={() => !hasError && postData()}>
                <Text style={[styles.text, styles.text3]}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCloseModal}>
                <Text style={[styles.text, styles.text3]}>Cancel</Text>
            </TouchableOpacity>
            </View>
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
        width: '90%',
        height: '65%',
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
        marginBottom: '5%',
        marginTop: '5%',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
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
        fontSize: 15,
        color: 'rgb(101, 152, 236)',
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
    container4:{
        paddingHorizontal: 5,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent:'space-around',
    },
  });
  