import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/colors'
import { horizontalScale, verticalScale } from '../../constants/helper'
import { Images } from '../../assets/images'
import Header from '../../components/Header'

export default function ConvertCoinScreen(props) {

    const [history, setHistory] = useState([
        {
            date: '11 Feb, 2024',
            usdt: '0.28'
        },
        {
            date: '13 Feb, 2024',
            usdt: '0.51'
        },
        {
            date: '15 Feb, 2024',
            usdt: '0.68'
        },
    ]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.blackColor}>Date</Text>
                    <Text style={styles.greyColor}>{item.date}</Text>
                </View>
                <View>
                    <Text style={styles.blackText}>USDT</Text>
                    <Text style={styles.greyText}>{item.usdt}</Text>
                </View>
            </View>
        )
    }

    return (
        <>
            <Header ishelp={true} />
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.giftIconContainer} source={Images.convertCoinIcon} />
                    </View>
                    <Text
                        style={styles.convertText}
                    >
                        Convert Super Coins
                    </Text>
                    <Text
                        style={styles.convertCoinText}
                    >
                        {`Convert you collected reward point in\nto crypto coins`}
                    </Text>

                    <View style={styles.rowContainer}>
                        <View style={styles.coinContainer}>
                            <Text style={styles.titleContainer}>Super coins</Text>
                            <Text style={styles.desc1}>460</Text>
                        </View>
                        <View style={styles.repostImage}>
                            <Image
                                style={styles.repostContainer}
                                source={Images.rePostIcon}
                            />
                        </View>
                        <View style={styles.usdtContainer}>
                            <Text style={styles.titleContainer}>USDT</Text>
                            <Text style={styles.desc2}>0.27</Text>
                        </View>
                    </View>

                    <Text
                        style={styles.coinText}
                    >
                        * Minimum
                        <Text style={styles.weight800}>
                            {" "}2,500 Super coins
                        </Text>
                        {" "}required to convert into USDT
                    </Text>

                    <View style={styles.deviderContainer} />

                    <Text style={styles.historyText}>History</Text>

                    <View style={styles.w100}>
                        <FlatList
                            data={history}
                            renderItem={renderItem}
                            contentContainerStyle={styles.contentContainer}
                        />
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    usdtContainer: {
        borderRadius: verticalScale(10),
        height: verticalScale(100),
        width: horizontalScale(160),
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    coinContainer: {
        backgroundColor: Colors.lightGrey,
        marginRight: horizontalScale(15),
        borderRadius: verticalScale(10),
        height: verticalScale(100),
        width: horizontalScale(160),
        justifyContent: 'center',
        alignItems: 'center'
    },
    repostImage: {
        backgroundColor: Colors.grey_500,
        position: 'absolute',
        alignSelf: 'center',
        borderRadius: verticalScale(20),
        height: verticalScale(35),
        width: verticalScale(35),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 111
    },
    desc2: {
        color: Colors.white,
        fontSize: verticalScale(17),
        fontWeight: '600',
        marginTop: verticalScale(7)
    },
    desc1: {
        color: Colors.black,
        fontSize: verticalScale(17),
        fontWeight: '600',
        marginTop: verticalScale(7)
    },
    titleContainer: {
        color: Colors.grey_500,
        fontSize: verticalScale(12)
    },
    repostContainer: {
        height: verticalScale(16),
        width: verticalScale(16),
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }]
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: verticalScale(15),
        justifyContent: 'center'
    },
    convertCoinText: {
        color: Colors.grey_500,
        textAlign: 'center',
        marginTop: verticalScale(10)
    },
    convertText: {
        color: Colors.black,
        fontWeight: '500',
        fontSize: verticalScale(20),
        marginTop: verticalScale(12)
    },
    imageContainer: {
        marginTop: verticalScale(-65),
        height: verticalScale(150),
        width: verticalScale(150),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondaryColor,
        borderRadius: verticalScale(80)
    },
    coinText: {
        color: Colors.grey_500,
        textAlign: 'center',
        marginTop: verticalScale(10),
        fontSize: verticalScale(11)
    },
    weight800: {
        fontWeight: '800'
    },
    deviderContainer: {
        width: '70%',
        height: verticalScale(1),
        backgroundColor: Colors.grey_500,
        marginTop: verticalScale(30)
    },
    historyText: {
        color: Colors.black,
        marginTop: verticalScale(20),
        fontSize: verticalScale(18),
        fontWeight: '500'
    },
    w100: {
        width: '100%'
    },
    container: {
        flex: 1,
        backgroundColor: Colors.semiGray,
    },
    innerContainer: {
        width: '100%',
        backgroundColor: Colors.white,
        height: '100%',
        marginTop: verticalScale(110),
        alignItems: 'center',
        borderTopRightRadius: verticalScale(30),
        borderTopLeftRadius: verticalScale(30),
    },
    giftIconContainer: {
        height: verticalScale(90),
        width: verticalScale(90),
        resizeMode: 'contain',
        tintColor: Colors.white
    },
    itemContainer: {
        paddingHorizontal: horizontalScale(10),
        height: verticalScale(55),
        width: horizontalScale(300),
        flexDirection: 'row',
        borderTopWidth: verticalScale(1),
        justifyContent: 'space-between',
        paddingTop: verticalScale(5)
    },
    blackColor: {
        color: Colors.black
    },
    greyColor: {
        color: Colors.grey_500
    },
    blackText: {
        textAlign: 'right',
        color: Colors.black
    },
    greyText: {
        textAlign: 'right',
        color: Colors.grey_500
    },
    contentContainer: {
        width: horizontalScale(370),
        alignItems: 'center',
        paddingTop: verticalScale(10)
    },
})