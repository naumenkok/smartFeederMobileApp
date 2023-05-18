import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'

export default function DateBar ({ myMarginTop, today, setToday, getBefYesterday, getYesterday, getTomorrow, getAftTomorrow }) {
    return (
        <View style={[styles().container, styles(myMarginTop).container1, styles().shadowProp]}>
            <TouchableOpacity onPress={() => setToday(getBefYesterday())} style={[styles().button, styles()[`button${getBefYesterday().getDate() % 5}`]]}>
                <Text style={styles().buttonText1}>{getBefYesterday().getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setToday(getYesterday())} style={[styles().button, styles()[`button${getYesterday().getDate() % 5}`]]}>
                <Text style={styles().buttonText1}>{getYesterday().getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles().button, styles()[`button${today.getDate() % 5}`], styles().buttoncenter, styles().shadowProp]}>
                <Text style={styles().buttonText1}>{today.getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setToday(getTomorrow())} style={[styles().button, styles()[`button${getTomorrow().getDate() % 5}`]]}>
                <Text style={styles().buttonText1}>{getTomorrow().getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setToday(getAftTomorrow())} style={[styles().button, styles()[`button${getAftTomorrow().getDate() % 5}`]]}>
                <Text style={styles().buttonText1}>{getAftTomorrow().getDate()}</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = (myMarginTop = '0%') => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 22,
    },
    container1: {
        flex: 10,
        marginBottom: '5%',
        marginTop: myMarginTop,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    shadowProp: {
        shadowColor: 'rgb(86, 41, 246)',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        flexDirection: 'row',
        height: '90%',
        width: '19%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 22,
        opacity: 0.6,
    },
    button1: { backgroundColor: 'rgb(126, 94, 240)'},
    button2: { backgroundColor: 'rgb(101, 152, 236)'},
    button3: { backgroundColor: 'rgb(250, 123, 205)'},
    button4: { backgroundColor: 'rgb(247, 159, 201)'},
    button0: { backgroundColor: 'rgb(250, 186, 171)'},
    buttoncenter: { top: 10, height: '99%', width: '20%', opacity: 1,},
    buttonText1: {
        fontSize: 34,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
    },
});

