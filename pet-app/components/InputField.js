import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

export default function InputField({
  label,
  inputType,
  keyboardType,
}) {
  return (
    <View
      style={styles.view}>
      {inputType == 'password' ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          secureTextEntry={true}
        />
      ) : (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    view: {
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
  });