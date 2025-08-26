import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { Images } from '../../assets/images';
import { verticalScale } from '../../constants/helper';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  // Create animated values for each bubble
  const bubbleAnimations = useRef(
    [...Array(40)].map(() => ({
      translateX: new Animated.Value(Math.random() * width),
      translateY: new Animated.Value(Math.random() * height),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
    }))
  ).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        setTimeout(() => {
          if (userDataString) {
            navigation.navigate('BottomTab');
          } else {
            navigation.navigate('OnBoardingScreen');
          }
        }, 5000);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    fetchData();

    // Start bubble animations
    const animations = bubbleAnimations.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim.translateX, {
              toValue: Math.random() * width,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: Math.random() * height,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0.5 + Math.random() * 0.5,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      )
    );

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Circles */}
      <View style={styles.circleBackground}>
        {bubbleAnimations.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.circle,
              {
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  { scale: anim.scale },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Logo Animation */}
      <Animatable.Image
        animation="bounceIn"
        duration={1500}
        source={Images.mainLogo}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Text Animation */}
      <Animatable.Text
        animation="fadeInUp"
        delay={500}
        style={styles.title}
      >
        MTC USDT Mining 
      </Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.borderLight,
  },
  logo: {
    height: verticalScale(120),
    width: verticalScale(120),
    tintColor: Colors.primaryColor,
  },
  title: {
    fontSize: 28,
    color: Colors.primaryColor,
    fontWeight: 'bold',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});