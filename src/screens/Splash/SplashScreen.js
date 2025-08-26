import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';
import {Colors} from '../../constants/colors';
import {Images} from '../../assets/images';
import {verticalScale} from '../../constants/helper';

const {width, height} = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const {isLoading, getInitialRoute} = useAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Bubble animations
  const bubbleAnimations = useRef(
    [...Array(30)].map(() => ({
      translateX: new Animated.Value(Math.random() * width),
      translateY: new Animated.Value(Math.random() * height),
      scale: new Animated.Value(0.3 + Math.random() * 0.7),
      opacity: new Animated.Value(0.3 + Math.random() * 0.4),
    })),
  ).current;

  // Animations
  const progressWidth = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ✅ Progress bar will reach 100% in exactly 4 seconds
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2.5; // 40 steps → 100% in 4s
      setLoadingProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);

    // ✅ Navigation after max 4 seconds
    const timer = setTimeout(() => {
      const initialRoute = getInitialRoute();
      if (!isLoading) {
        navigation.replace(initialRoute);
      } else {
        navigation.replace('OnBoardingScreen');
      }
    }, 4000);

    // Logo animations
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
        }),
      ),
    ]).start();

    // Bubble animations
    const animations = bubbleAnimations.map(anim =>
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
        ]),
      ),
    );
    animations.forEach(anim => anim.start());

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
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

  const spin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
                  {translateX: anim.translateX},
                  {translateY: anim.translateY},
                  {scale: anim.scale},
                ],
                opacity: anim.opacity,
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.mainContent, {opacity: fadeAnim}]}>
        <Animated.View style={styles.logoContainer}>
          <Animated.Image
            source={Images.mainLogo}
            style={[
              styles.logo,
              {
                transform: [{scale: logoScale}, {rotate: spin}],
              },
            ]}
            resizeMode="contain"
          />
          <View style={styles.logoGlow} />
        </Animated.View>

        <Animatable.Text
          animation="fadeInUp"
          delay={1000}
          duration={1500}
          style={styles.title}>
          MTC USDT Mining
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          delay={1500}
          duration={1000}
          style={styles.subtitle}>
          Your Gateway to Digital Mining
        </Animatable.Text>
      </Animated.View>

      {/* Loading Progress */}
      <Animated.View
        style={[styles.loadingContainer, {opacity: fadeAnim}]}
        animation="fadeInUp"
        delay={2000}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>
          Loading... {Math.round(loadingProgress)}%
        </Text>
      </Animated.View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderLight,
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    height: verticalScale(140),
    width: verticalScale(140),
    tintColor: Colors.primaryColor,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    height: verticalScale(160),
    width: verticalScale(160),
    borderRadius: verticalScale(80),
    backgroundColor: Colors.primaryColor,
    opacity: 0.1,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    color: Colors.primaryColor,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.shadeGrey,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    width: '80%',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primaryColor,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.shadeGrey,
    marginTop: 15,
    fontWeight: '500',
  },
});
