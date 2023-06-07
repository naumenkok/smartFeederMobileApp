import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import LogoScreen from '../screens/LogoScreen';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import UserScreen from '../screens/UserScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ animationEnabled: false, animationTypeForReplace: 'pop' }}>
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
          name="LogoScreen"
          component={LogoScreen}
          initialParams={{ id:0 }}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          initialParams={{ id:0 }}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          initialParams={{ id:0 }}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
          name="UserScreen"
          component={UserScreen}
          initialParams={{ id:0 }}
          options={{headerShown: false, animation: 'none'}}
        />
        <Stack.Screen
            name="HistoryScreen"
            component={HistoryScreen}
            initialParams={{ id:0, today:new Date().toISOString() }}
            options={{headerShown: false, gestureEnabled: false, animation: 'none'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
