import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import LogoScreen from '../screens/LogoScreen';
import HomeScreen from '../screens/HomeScreen';
import MessegeScreen from '../screens/MessegeScreen';
import UserScreen from '../screens/UserScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ animationEnabled: false, animationTypeForReplace: 'pop' }}>
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LogoScreen"
          component={LogoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: "HomeScreen"}}
        />
        <Stack.Screen
          name="MessegeScreen"
          component={MessegeScreen}
          options={{headerShown: "MessegeScreen"}}
        />
        <Stack.Screen
          name="UserScreen"
          component={UserScreen}
          options={{headerShown: "UserScreen"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
