import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import LogIn from './screens/LogInScreen';
import SignUp from './screens/SignUpScreen';
import AppNavigator from './navigation/LogInSignUpNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppNavigator />
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'MainScreen' }}/>
    //     <Stack.Screen name="SignUp" component={LogIn} options={{ title: 'SignUp' }}/>
    //     <Stack.Screen name="LogIn" component={LogIn} options={{ title: 'LogIn' }}/>
    //   </Stack.Navigator>
    // </NavigationContainer>
    );

}