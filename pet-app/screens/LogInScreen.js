import React from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import InputField from '../components/InputField';

export default function  LogIn ({ navigation }) {
    return(
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
        <View style={styles.topContainer} />
            <View style={styles.container1}>
                    <Text style={styles.text1}>log in</Text>
                    <Text style={styles.text2}>|   </Text>
                    <TouchableOpacity 
                            onPress={() => navigation.navigate('SignUpScreen')}>
                        <Text style={styles.text3}>sign up</Text>
                    </TouchableOpacity>
            </View>
            <View style={styles.container2}>
                    <InputField  label={'Enter your email ...'}
                        keyboardType="email-address"
                        />
            </View>
            <View style={styles.container3}>
                    <InputField  label={'Enter your password ...'}
                        inputType="password"
                        />
            </View> 
            <View style={styles.container4}>
                <TouchableOpacity 
                        onPress={() => navigation.navigate('LogoScreen')}
                        style={styles.button}>
                    <Text style={styles.buttonText1}>log in</Text>
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
        justifyContent: "flex-end",
    },
    topContainer: {
        flex: 1,
    },
    container1: {
        flex: 2,
        flexDirection: 'row',
        paddingHorizontal: 50,
        alignItems: "flex-end",
        justifyContent: 'space-between',
    },
    container2: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "flex-end",
        paddingHorizontal: 50,
        paddingBottom: 0,
    },
    container3: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "flex-start",
        paddingHorizontal: 50,
        paddingTop: 0,
    },
    container4: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "flex-start",
        paddingHorizontal: 50,
        paddingBottom: 300,
    },
    text1: {
        opacity: 1,
        fontSize: 35,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
        // fontFamily: 'AlBayan',
    },
    text2: {
        opacity: 1,
        fontSize: 35,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
        // fontFamily: 'AlBayan',
    },
    text3: {
        opacity: 0.75,
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
        paddingBottom: "2%", 
        // fontFamily: 'AlBayan',
        // ...styles.text1,
        // opacity: 0.5,
    },
    button: {
        flexDirection: 'row',
        height: 60,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: -10,
        margin: 25,
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 22,
    },
    buttonText1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
    },
  });
