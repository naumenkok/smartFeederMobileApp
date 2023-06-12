import React, {useState, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ActivityIndicator} from 'react-native';
import AppNavigator from './navigation/LogInSignUpNavigator';
import {AppLoading} from "expo";
import {Asset} from "expo-asset";
const Stack = createNativeStackNavigator();

function useImages(images) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Asset.loadAsync(images)
        .then(() => setLoaded(true))
        .catch(setError);
  }, []);

  return [loaded, error];
}

export default function App() {
  const [imagesLoaded] = useImages([
    require('./img/background.jpg'),
  ]);

  if (!imagesLoaded) {
    <ActivityIndicator size="large" color="#00ff00" />
  }
  return (
    <AppNavigator />
    );

}