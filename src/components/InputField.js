import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { horizontalScale, verticalScale } from '../constants/helper';
import { Colors } from '../constants/colors';

export default function InputField(props) {

    const { title, placeholder, onChangeT, errorTitle } = props;

    return (
        <>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={Colors.shadeGrey}
                    onChangeText={text => onChangeT(text)}
                    style={styles.blackColor}
                />

            </View>
                <Text style={styles.errorText}>{errorTitle}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    titleText: {
        color: Colors.black,
        marginLeft: horizontalScale(20),
        fontWeight: '500'
    },
    inputContainer: {
        width: horizontalScale(340),
        height: verticalScale(45),
        borderWidth: verticalScale(1.2),
        borderColor: Colors.grey_500,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: horizontalScale(10),
        backgroundColor: Colors.white,
        marginTop: verticalScale(7),
        borderRadius: verticalScale(10)
    },
    blackColor: { color: Colors.black },
    errorText: {
        color: Colors.darkRed,
        fontSize: 12,
        marginTop: 5,
        marginHorizontal: 15,
    },
})