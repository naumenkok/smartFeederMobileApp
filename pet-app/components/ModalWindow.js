import React from 'react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { View, ImageBackground, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function ModalWindow({ visible, onClose }) {

    const [data, setData] = useState('');
  
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAmountInDate', 
        {
            "date":"2023-04-23"
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
    }, []);

  return (
    <Modal visible={visible} animationType='slide'>
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
      <View style={[styles.modalContent,styles.shadowProp]}>
        <Text style={styles.modalText}>This is a modal window</Text>
        <Text style={[styles.modalText]}>Food:</Text>
        <Text style={[styles.modalText]}>{data.message}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalCloseText}>Close</Text>
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
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 22,
        backgroundColor: 'white',
        flexDirection: 'column',
        // justifyContent: 'space-evenly',
        justifyContent: 'space-around',
        alignItems: 'center',
        // justifyContent: 'center',
        width: '80%',
        height: '40%',
      },
      modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
        textAlign: 'center',
        color: 'rgb(250, 123, 205)',
      },
      modalCloseText: {
        color: 'blue',
        fontSize: 16,

      },
      shadowProp: {  
          shadowColor: 'rgb(86, 41, 246)',
          shadowOpacity: 0.5,
          shadowOffset: { width: 0, height: 2},
          shadowRadius: 10,
          elevation: 10,
        }, 
  });
  