import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { Images } from '../../assets/images';
import { verticalScale } from '../../constants/helper';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Create animated values for each bubble
  const bubbleAnimations = useRef(
    [...Array(30)].map(() => ({
      translateX: new Animated.Value(Math.random() * width),
      translateY: new Animated.Value(Math.random() * height),
      scale: new Animated.Value(0.3 + Math.random() * 0.7),
      opacity: new Animated.Value(0.3 + Math.random() * 0.4),
    }))
  ).current;

  // Progress bar animation
  const progressWidth = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check both userData and onboarding completion
        const userDataString = await AsyncStorage.getItem('userData');
        const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');

        // Start loading progress animation
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                if (userDataString) {
                  navigation.navigate('BottomTab');
                } else if (onboardingCompleted === 'true') {
                  navigation.navigate('LoginScreen');
                } else {
                  navigation.navigate('OnBoardingScreen');
                }
              }, 500);
              return 100;
            }
            return prev + 2;
          });
        }, 50);

      } catch (error) {
        console.error('Error retrieving user data:', error);
        setTimeout(() => navigation.navigate('OnBoardingScreen'), 3000);
      }
    };

    fetchData();

    // Start logo animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Start bubble animations with improved physics
    const animations = bubbleAnimations.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim.translateX, {
              toValue: Math.random() * width,
              duration: 4000 + Math.random() * 3000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: Math.random() * height,
              duration: 4000 + Math.random() * 3000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0.2 + Math.random() * 0.8,
              duration: 2000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0.1 + Math.random() * 0.6,
              duration: 1500 + Math.random() * 1500,
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

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: loadingProgress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [loadingProgress]);

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
