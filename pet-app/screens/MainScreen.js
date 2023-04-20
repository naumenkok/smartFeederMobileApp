import React from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Button, Image, Alert } from 'react-native';
import { useState } from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';

export default function MainScreen ({ navigation }) {
  // let [fontsLoaded] = useFonts({
  //   'AlBayan': require('./../assets/fonts/AlBayan.ttf'),
  // })
  // const [dataLoaded, setDataLoaded] = useState(false);

  // if (!fontsLoaded) {
  //   return (
  //     <AppLoading/>
  //   );
  // }


//   function myTouch(){
//     navigation.navigate('LogIn');
//  }

  return (
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
        <View style={styles.container}>
            <View style={styles.textContainer1}>
                <Text style={styles.text} > SMART {'\n'}FEDEER</Text>
            </View>
        </View>

        <TouchableOpacity 
                onPress={() => navigation.navigate('LogInScreen')}
                  style={styles.button}>
            <Text style={styles.buttonText1}>log in</Text>
            <Image source={require('./../img/Arrow.png')} style={styles.arrow} />
        </TouchableOpacity>
        <View style={styles.textContainer2}>
            <TouchableOpacity 
                    onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={styles.text2} >sign up</Text>
            </TouchableOpacity>
        </View>

        
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    imageBackground: {
        opacity: 0.7,
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
      },
      container: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-start",
        paddingTop:"80%",
      },
      textContainer1: {
        padding: 20,
        bottom: 150,
        borderRadius: 10,
        marginRight: 10,
      },
      text: {
        color: "white",
        fontSize:36,
        fontWeight: 'bold',
        // fontFamily: 'AlBayan',
      },
      button: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        bottom: -50,
        margin: 25,
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 22,
      },
      buttonText1: {
        left:40,
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
      },
      arrow: {
        right: 25,
        width: 85,
        height: 24,
      },
      textContainer2: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "15%",
      },
      text2: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
        paddingBottom: "25%", 
        // fontFamily: 'AlBayan',
      },
  });
  