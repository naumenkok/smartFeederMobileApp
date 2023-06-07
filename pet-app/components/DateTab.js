import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import axios from "axios";

export default function DateBar ({ myMarginTop, isHistory, today, setToday }) {
    const renderTouchableOpacity = (day) => {
        const currentDate = new Date(today.getTime());
        currentDate.setDate(currentDate.getDate() + day);
        const buttonStyle = day === 0 ? [styles(myMarginTop, isHistory)[`button${today.getDate() % 5}`], styles(myMarginTop, isHistory).buttoncenter] : styles(myMarginTop, isHistory)[`button${currentDate.getDate() % 5}`];
        return (
            <TouchableOpacity
                onPress={() => setToday(currentDate)}
                style={[styles(myMarginTop, isHistory).button, buttonStyle, styles(myMarginTop, isHistory).shadowProp]}
                key={day}
            >
                <Text style={styles(myMarginTop, isHistory).buttonText1}>{currentDate.getDate()}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles(myMarginTop, isHistory).container, styles(myMarginTop, isHistory).container1, styles(myMarginTop, isHistory).shadowProp]}>
            {(() => {
                const components = [];
                const dayAmounts = isHistory? 4:2;
                for (let day = -dayAmounts; day <= dayAmounts; day++) {
                    components.push(renderTouchableOpacity(day));
                }
                return components;
            })()}
        </View>
    );
};
const styles = (myMarginTop = '0%', isHistory = false) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: '5%',
        left: isHistory? 14:0,
        bottom: isHistory? 20:0,
        borderRadius: 22,
        height: isHistory? '6%':'80%' ,
    },
    container1: {
        flex: isHistory? 0:10,
        marginBottom: isHistory? '0%':'5%',
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
        width: isHistory? '11%':'19%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: isHistory? 4:5,
        borderColor: "white",
        borderRadius: isHistory? 15:22,
        opacity: 0.6,
    },
    button1: { backgroundColor: 'rgb(126, 94, 240)'},
    button2: { backgroundColor: 'rgb(101, 152, 236)'},
    button3: { backgroundColor: 'rgb(250, 123, 205)'},
    button4: { backgroundColor: 'rgb(250, 186, 171)'},
    button0: { backgroundColor: 'rgb(252, 212, 140)'},
    buttoncenter: {
        top: isHistory? -10:18,
        height: '95%', width: isHistory? '12%':'20%', opacity: 1,},
    buttonText1: {
        fontSize: isHistory? 14:34,
        fontWeight: 'bold',
        color: "white",
        textTransform: 'uppercase',
    },
});

