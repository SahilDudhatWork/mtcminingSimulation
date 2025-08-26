import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { Colors } from '../../constants/colors';
import CustomStatusBar from '../../components/CustomStatusBar';
import { horizontalScale, verticalScale } from '../../constants/helper';
import { Images } from '../../assets/images';

export default function OnBoardingScreen(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const list = [
    {
      image: Images.onboardScreen1,
      title1: '',
      title2: 'Hey!',
      title3: 'Welcome',
      desc: '“ We provide you the best mining experience with our simulation app ”',
    },
    {
      image: Images.onboardScreen2,
      title1: 'Refer',
      title2: 'Friends',
      title3: '',
      desc: '“ Join the exclusive league of wealth builders! Refer friends to our platform and watch as your Master Coins multiply ”',
    },
    {
      image: Images.onboardScreen3,
      title1: '',
      title2: 'Build Your',
      title3: 'Fortune',
      desc: `“ Your network is your greatest asset – let's grow together on this rewarding journey ”`,
    },
    {
      image: Images.onboardScreen4,
      title1: 'Mine Your',
      title2: 'Dreams',
      title3: '',
      desc: '“ Learn and practice the art of mining with our top-notch simulation app ”',
    },
  ];

  const Slider = () => {
    return (
      <>
        <Animatable.Text
          animation="fadeInRight"
          duration={1000}
          style={styles.skipText}
          key={`skip-${currentIndex}`}
          onPress={() => {
            props.navigation.navigate('BottomTab');
          }}>
          Skip
        </Animatable.Text>
        <View style={styles.sliderContainer}>
          <Animatable.Image
            animation="slideInUp"
            duration={1200}
            style={styles.sliderImage}
            source={list[currentIndex].image}
            key={`image-${currentIndex}`}
          />
          <Animatable.Text
            animation="fadeInUp"
            delay={200}
            style={styles.sliderText1}
            key={`title-${currentIndex}`}>
            {list[currentIndex].title1}
            <Text style={{ color: Colors.black }}>
              {' '}{list[currentIndex].title2}
            </Text>
            <Text style={{ color: Colors.secondaryColor }}>
              {list[currentIndex].title3}
            </Text>
          </Animatable.Text>
          <Animatable.Text
            animation="fadeInUp"
            delay={400}
            style={styles.descText1}
            key={`desc-${currentIndex}`}>
            {list[currentIndex].desc}
          </Animatable.Text>
        </View>
        <View style={styles.rowCentered}>
          <Animatable.View
            animation="bounceIn"
            delay={600}
            key={`prev-button-${currentIndex}`}>
            <TouchableOpacity
              onPress={() => {
                setCurrentIndex(currentIndex - 1);
              }}
              disabled={currentIndex < 1}
              style={styles.smallLessThanImageContainer}>
              <Image
                style={styles.smallLessThanImage}
                source={Images.lessThanIcon}
              />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            animation="bounceIn"
            delay={800}
            key={`next-button-${currentIndex}`}>
            <TouchableOpacity
              onPress={() => {
                if (currentIndex < 3) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  props.navigation.navigate('BottomTab');
                }
              }}
              style={styles.lessThanIconContainer}>
              <Image style={styles.lessThanImage} source={Images.lessThanIcon} />
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </>
    );
  };

  return (
    <>
      <CustomStatusBar dark backgroundColor={Colors.secondaryColor} />
      {Slider()}
    </>
  );
}

const styles = StyleSheet.create({
  sliderText1: {
    fontSize: verticalScale(30),
    fontWeight: '500',
    marginTop: verticalScale(15),
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  descText1: {
    textAlign: 'center',
    color: Colors.shadeGrey,
    marginTop: verticalScale(6),
    width: '80%',
    fontSize: verticalScale(14),
  },
  skipText: {
    textAlign: 'center',
    marginRight: horizontalScale(10),
    marginTop: verticalScale(10),
    position: 'relative',
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: verticalScale(20),
    overflow: 'hidden',
    width: horizontalScale(70),
    fontSize: verticalScale(12),
    alignSelf: 'flex-end',
  },
  sliderImage: {
    height: verticalScale(350),
    width: verticalScale(350),
    resizeMode: 'contain',
  },
  sliderContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCentered: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  smallLessThanImageContainer: {
    height: verticalScale(40),
    width: verticalScale(40),
    backgroundColor: Colors.secondaryColor,
    borderRadius: verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallLessThanImage: {
    height: verticalScale(20),
    width: verticalScale(20),
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  lessThanIconContainer: {
    height: verticalScale(40),
    width: verticalScale(40),
    backgroundColor: Colors.secondaryColor,
    borderRadius: verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessThanImage: {
    height: verticalScale(20),
    width: verticalScale(20),
    resizeMode: 'contain',
    tintColor: Colors.white,
    transform: [{ rotate: '180deg' }],
  },
});