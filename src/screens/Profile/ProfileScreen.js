import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { Images } from '../../assets/images'
import { horizontalScale, verticalScale } from '../../constants/helper'
import { Colors } from '../../constants/colors'

export default function ProfileScreen(props) {
    return (
        <View style={styles.container}>
            <Header
                ishelp={true}
            />

            <View
                style={styles.profileImageContainer}
            >
                <Image
                    style={styles.profileImage}
                    source={Images.girlFaceIcon}
                />
                <Pressable
                    style={styles.editContainer}
                    onPress={() => { }}
                >
                    <Image
                        style={styles.editImage}
                        source={Images.editIcon}
                    />
                </Pressable>
            </View>

            <Text
                style={styles.nameText}>
                Hii Test
            </Text>
            <Text
                style={styles.idText}
            >
                #TH1707461793717
            </Text>

            <View style={styles.itemContainer}>
                <View style={styles.alignCentered}>
                    <View style={[styles.itemImageContainer, {backgroundColor: Colors.secondaryColor}]}>
                        <Image source={Images.TLogo} style={styles.usdtImage} />
                    </View>
                    <Text style={styles.itemText}>0 USDT</Text>
                    <Text style={styles.itemDesc}>Current balance</Text>
                </View>
                <View style={styles.alignCentered}>
                    <View style={styles.itemImageContainer}>
                        <Image source={Images.starIcon} style={styles.coinsImage} />
                    </View>
                    <Text style={styles.itemText}>442</Text>
                    <Text style={styles.itemDesc}>Super coins</Text>
                </View>
            </View>

            <Pressable
                onPress={() => { props.navigation.navigate('ConvertCoinScreen') }}
                style={styles.pressableContainer}
            >
                <View
                    style={styles.handShakeContainer}
                >
                    <Image
                        style={styles.rePostImage}
                        source={Images.rePostIcon}
                    />
                </View>
                <View>
                    <Text style={styles.titleText}>Convert super coins</Text>
                    <Text style={styles.descText}>Convert your super coins into the USDT</Text>
                </View>
            </Pressable>

            <Pressable
                onPress={() => { props.navigation.navigate('Rafers') }}
                style={styles.pressableContainer}
            >
                <View style={styles.handShakeContainer}>
                    <Image
                        style={styles.handShakeImage}
                        source={Images.handShakeIcon}
                    />
                </View>
                <View>
                    <Text style={styles.titleText}>Rafer friends!</Text>
                    <Text style={styles.descText}>Invite your friend and get rewards!</Text>
                </View>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    profileImageContainer: {
        height: verticalScale(180),
        width: verticalScale(180),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: verticalScale(180),
        alignSelf: 'center',
        marginTop: verticalScale(40)
    },
    profileImage: {
        height: verticalScale(165),
        width: verticalScale(165),
        resizeMode: 'contain'
    },
    editImage: {
        height: verticalScale(15),
        width: verticalScale(15),
        resizeMode: 'contain',
    },
    editContainer: {
        backgroundColor: Colors.grey_500,
        height: verticalScale(30),
        width: verticalScale(30),
        borderRadius: verticalScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 5,
        right: 25
    },
    nameText: {
        color: Colors.black,
        fontWeight: "500",
        fontSize: 18,
        textAlign: 'center',
        marginTop: verticalScale(20)
    },
    idText: {
        color: Colors.secondaryColor,
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: "500",
        textAlign: 'center'
    },
    coinsImage: {
        height: verticalScale(25),
        width: verticalScale(25),
        resizeMode: 'center'
    },
    usdtImage: {
        height: verticalScale(20),
        width: verticalScale(20),
        resizeMode: 'center'
    },
    itemDesc: {
        color: Colors.grey_500,
        fontSize: verticalScale(12)
    },
    itemText: {
        color: Colors.black,
        fontWeight: '600',
        marginTop: verticalScale(5)
    },
    itemImageContainer: {
        height: verticalScale(45),
        width: verticalScale(45),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: verticalScale(25)
    },
    alignCentered: {
        alignItems: 'center'
    },
    itemContainer: {
        marginTop: verticalScale(25),
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    rePostImage: {
        height: verticalScale(15),
        width: verticalScale(15),
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }],
        tintColor: Colors.secondaryColor
    },
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: verticalScale(13),
        color: Colors.black,
        fontWeight: '600'
    },
    descText: {
        fontSize: verticalScale(10),
        color: Colors.grey_500
    },
    handShakeImage: {
        height: verticalScale(20),
        width: verticalScale(20),
        resizeMode: 'contain',
    },
    handShakeContainer: {
        height: verticalScale(35),
        width: verticalScale(35),
        borderRadius: verticalScale(20),
        backgroundColor: Colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: horizontalScale(10)
    },
    pressableContainer: {
        height: verticalScale(60),
        width: '85%',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginTop: verticalScale(20),
        alignItems: 'center',
        paddingHorizontal: horizontalScale(15),
        borderRadius: verticalScale(10)
    },
})