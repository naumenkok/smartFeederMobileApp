import React, {useEffect, useState} from 'react';
import {ImageBackground, View, StyleSheet, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import Constants from "expo-constants";
import axios from "axios";

export default function  SignUp ({ navigation }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasError, setHasError] = useState(false);
    const [showError, setShowError] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    useEffect(() => {
        const isError = !isValidEmail(email) || (name === '') || (username === '') || (password === '') || (email === '');
        setHasError(isError);
    }, [email, name, username, password]);

    const postData = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            await axios.post(`http://${ipAddress}:8080/registerNewUser?username=${username}&password=${password}&name=${name}&email=${email}`);
            console.log(username);
            console.log(password);
        } catch (error) {
            console.error(error);
        }
    };

    return(
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
            <View style={styles.container1}>
                    <TouchableOpacity 
                            onPress={() => navigation.navigate('LogInScreen')}>
                        <Text style={styles.text3}>log in</Text>
                    </TouchableOpacity>
                    <Text style={styles.text2}>     |</Text>
                    <Text style={styles.text1}>sign up</Text>
            </View>
            <View style={styles.container2}>
                <View style={styles.input}>
                    <TextInput
                        placeholder={'Enter your name ...'}
                        onChangeText={name => {
                            setName(name);
                        }}
                    />
                </View>
            </View>
            <View style={styles.container2}>
                <View style={styles.input}>
                    <TextInput
                        placeholder={'Enter your username ...'}
                        onChangeText={username => {
                            setUsername(username);
                        }}
                    />
                </View>
            </View>
            <View style={styles.container2}>
                <View style={styles.input}>
                    <TextInput
                        placeholder={'Enter your email ...'}
                        onChangeText={email => {
                            setEmail(email);
                        }}
                    />
                </View>
            </View>
            <View style={styles.container2}>
                <View style={styles.input}>
                    <TextInput
                        placeholder={'Enter password ...'}
                        onChangeText={password => {
                            setPassword(password);
                        }}
                    />
                </View>
            </View>
            <View style={styles.container4}>
                {hasError && showError && <Text style={styles.text3}>Wrong input data!</Text>}
                <TouchableOpacity 
                        onPress={() =>{
                            setShowError(true);
                            hasError === false && postData() && navigation.navigate('LogInScreen');
                            // hasError === false && navigation.navigate('LogoScreen');
                        }}
                        style={styles.button}>
                    <Text style={styles.buttonText1}>sign up</Text>
                </TouchableOpacity>
            </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    imageBackground: {
        opacity: 0.7,
        flex: 1,
        justifyContent: "flex-end",
    },
    container1: {
        flexDirection: 'row',
        paddingHorizontal: 50,
        left: 10,
        alignItems: "flex-end",
        justifyContent: 'space-between',
    },
    container2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "flex-end",
        paddingHorizontal: 50,
    },
    container4: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: 50,
        paddingBottom: 100,
    },
    input: {
        flexDirection: 'row',
        height: 60,
        width: 300,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 22,
        backgroundColor: "white",
    },
    text1: {
        opacity: 1,
        fontSize: 35,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
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
