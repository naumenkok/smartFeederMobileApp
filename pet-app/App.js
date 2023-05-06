import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './navigation/LogInSignUpNavigator';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppNavigator />
    );

}