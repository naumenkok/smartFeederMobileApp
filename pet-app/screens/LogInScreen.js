import React, {useEffect, useState} from 'react';
import {ImageBackground, View, StyleSheet, Text, TouchableOpacity, TextInput} from 'react-native';
import Constants from "expo-constants";
import axios from "axios";

export default function  LogIn ({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hasError, setHasError] = useState(false);
    const [showError, setShowError] = useState(false);
    const [id, setId] = useState(0);

    useEffect(() => {
        const isError = (username === '') || (password === '') || (id == 0);
        setHasError(isError);
    }, [username, password, id]);

    const getID = async () => {
        try {
            const ipAddress = Constants.manifest.debuggerHost.split(':').shift();
            const response = await axios.get(`http://${ipAddress}:8080/checkLogin`, {
                params: {
                    username: username,
                    password: password
                }
            });
            setId(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return(
    <ImageBackground source={require('./../img/background.jpg')} style={styles.imageBackground}>
            <View style={styles.container1}>
                    <Text style={styles.text1}>log in</Text>
                    <Text style={styles.text2}>|    </Text>
                    <TouchableOpacity 
                            onPress={() => navigation.navigate('SignUpScreen')}>
                        <Text style={styles.text3}>sign up</Text>
                    </TouchableOpacity>
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
            <View style={styles.container3}>
                <View style={styles.input}>
                    <TextInput
                        placeholder={'Enter your password ...'}
                        secureTextEntry={true}
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
                            getID();
                            hasError === false && id !== 0 && navigation.navigate('LogoScreen', { id:id });
                            console.log(showError);
                            console.log(id);
                            console.log(hasError);
                        }}
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
        justifyContent: "flex-end",
    },
    topContainer: {
    },
    container1: {
        flexDirection: 'row',
        paddingHorizontal: 50,
        alignItems: "flex-end",
        justifyContent: 'space-between',
    },
    container2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "flex-end",
        paddingHorizontal: 50,
        paddingBottom: 0,
    },
    container3: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "flex-start",
        paddingHorizontal: 50,
        paddingTop: 0,
    },
    container4: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: 50,
        paddingBottom: 300,
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
    },
    text3: {
        opacity: 0.75,
        fontSize: 22,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
        paddingBottom: "2%",
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
