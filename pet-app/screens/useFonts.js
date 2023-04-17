import * as Font from "expo-font";
 
export default useFonts = async () =>
  await Font.loadAsync({
    'Inter-Black': require('./assets/fonts/AlBayan.ttf'),
  });