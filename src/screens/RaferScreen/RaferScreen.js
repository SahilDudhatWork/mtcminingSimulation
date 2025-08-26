import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/colors'
import { horizontalScale, verticalScale } from '../../constants/helper'
import { Images } from '../../assets/images'
import Header from '../../components/Header'

export default function RaferScreen() {

  return (
    <>
      <Header ishelp={true} />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image style={styles.giftIconContainer} source={Images.handShakeIcon} />
          <Text style={styles.titleText}>Rafer Friends!</Text>
          <Text style={styles.mainDescContainer}>{`Invite friend, collect rewards. It's that\neasy!`}</Text>
          <View
            style={styles.soonContainer}
          >
            <View
              style={styles.soonInnerContainer}
            >
              <Text style={styles.soonText}>Coming soon...</Text>
              <Text style={styles.soonDesc1}>Our technical team is currently working on the refer feature. This feature is available in upcomming release.</Text>
              <Text style={styles.soonDesc1}>Thank you for your support.</Text>
            </View>
            <View style={styles.btnContainer}
            >
              <Text style={styles.inviteText}>Invite Friend</Text>
            </View>
            <Text style={styles.tncText}>Terms & Conditions*</Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  tncText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: verticalScale(11),
    textAlign: 'center',
    marginTop: verticalScale(5)
  },
  inviteText: {
    color: 'rgba(42, 63, 189, 0.35)',
    fontWeight: '600',
    fontSize: verticalScale(12)
  },
  btnContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: verticalScale(10),
    marginTop: '5%',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  soonDesc1: {
    fontSize: verticalScale(12),
    marginTop: verticalScale(10),
    color: Colors.white
  },
  soonText: {
    fontSize: verticalScale(12),
    color: Colors.white
  },
  soonInnerContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: verticalScale(10),
    marginTop: '5%',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(12)
  },
  soonContainer: {
    width: '90%',
    height: verticalScale(250),
    backgroundColor: 'rgba(42, 63, 189, 0.35)',
    borderRadius: verticalScale(10),
    marginTop: verticalScale(20)
  },
  container: {
    flex: 1,
    backgroundColor: Colors.semiGray,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    height: '74%',
    marginTop: verticalScale(110),
    alignItems: 'center',
    borderTopRightRadius: verticalScale(30),
    borderTopLeftRadius: verticalScale(30),
  },
  giftIconContainer: {
    height: verticalScale(150),
    width: verticalScale(150),
    resizeMode: 'contain',
    marginTop: verticalScale(-65)
  },
  titleText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: verticalScale(20),
    marginTop: verticalScale(12)
  },
  mainDescContainer: {
    color: Colors.grey_500,
    textAlign: 'center',
    marginTop: verticalScale(10)
  },
})