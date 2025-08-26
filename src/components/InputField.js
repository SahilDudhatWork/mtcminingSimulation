import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { verticalScale } from '../constants/helper';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function InputField(props) {
    const { title, placeholder, onChangeT, errorTitle } = props;

    return (
        <>
            <Text style={styles.titleText}>{title}</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors.shadeGrey}
                onChangeText={text => onChangeT(text)}
                style={styles.inputContainer}
            />
            <Text style={styles.errorText}>{errorTitle}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    titleText: {
        color: Colors.black,
        marginLeft: 20,
        fontWeight: '500'
    },
    inputContainer: {
        width: "100%", // 🔥 90% of screen width
        height: verticalScale(45),
        borderWidth: verticalScale(1.2),
        borderColor: Colors.grey_500,
        // alignSelf: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        borderRadius: verticalScale(10)
    },
    errorText: {
        color: Colors.darkRed,
        fontSize: 12,
        marginTop: 5,
        marginHorizontal: 15,
    },
})
