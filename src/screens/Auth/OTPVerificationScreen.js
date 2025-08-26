import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Animatable from 'react-native-animatable';
import {useAuth} from '../../context/AuthContext';
import {Colors} from '../../constants/colors';
import CustomStatusBar from '../../components/CustomStatusBar';
import Button from '../../components/Button';
import {horizontalScale, verticalScale} from '../../constants/helper';

export default function OTPVerificationScreen({navigation, route}) {
  const {type, email, mobile, verificationType, userData} = route.params;
  const {login, signup} = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return false;
    }
    return true;
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const otpString = otp.join('');

      if (type === 'signup') {
        if (verificationType === 'mobile') {
          // After mobile verification, verify email
          navigation.navigate('OTPVerificationScreen', {
            type: 'signup',
            email: email,
            mobile: mobile,
            verificationType: 'email',
            userData: userData,
          });
        } else {
          // Both mobile and email verified, complete signup
          await completeSignup();
        }
      } else {
        // Login verification complete
        await completeLogin();
      }
    } catch (error) {
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = async () => {
    try {
      const userDataToSave = {
        ...userData,
        verifiedMobile: true,
        verifiedEmail: true,
      };

      const result = await signup(userDataToSave);

      if (result.success) {
        Alert.alert('Success!', 'Your account has been created successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BottomTab'),
          },
        ]);
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to complete signup. Please try again.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete signup. Please try again.');
    }
  };

  const completeLogin = async () => {
    try {
      const loginData = {
        email: email,
      };

      const result = await login(loginData);

      if (result.success) {
        Alert.alert('Welcome Back!', 'You have been logged in successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BottomTab'),
          },
        ]);
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to complete login. Please try again.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete login. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);

      Alert.alert('Success', 'OTP has been resent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const getVerificationMessage = () => {
    const target = verificationType === 'mobile' ? mobile : email;
    const method = verificationType === 'mobile' ? 'SMS' : 'email';

    return `We've sent a 6-digit verification code via ${method} to ${target}`;
  };

  const getHeaderTitle = () => {
    if (type === 'signup') {
      return verificationType === 'mobile'
        ? 'Verify Mobile Number'
        : 'Verify Email Address';
    }
    return 'Verify Your Identity';
  };

  return (
    <>
      <CustomStatusBar dark backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={styles.headerContainer}>
          <Text style={styles.title}>{getHeaderTitle()}</Text>
          <Text style={styles.subtitle}>{getVerificationMessage()}</Text>
        </Animatable.View>

        {/* OTP Input Container */}
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          duration={1000}
          style={styles.otpContainer}>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[styles.otpInput, digit ? styles.otpInputFilled : {}]}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={({nativeEvent}) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Timer and Resend */}
          <View style={styles.resendContainer}>
            {!canResend ? (
              <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendLoading}
                style={styles.resendButton}>
                <Text style={styles.resendText}>
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Verify & Continue"
              onPress={handleVerifyOTP}
              loading={loading}
              disabled={loading || otp.join('').length !== 6}
            />
          </View>

          {/* Help Text */}
          <Animatable.View
            animation="fadeInUp"
            delay={600}
            style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Didn't receive the code?{'\n'}
              Check your spam folder or contact support
            </Text>
          </Animatable.View>

          {/* Change Contact Info */}
          <TouchableOpacity
            style={styles.changeContactButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.changeContactText}>
              Change{' '}
              {verificationType === 'mobile'
                ? 'mobile number'
                : 'email address'}
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Progress Indicator for Signup */}
        {type === 'signup' && (
          <Animatable.View
            animation="fadeInUp"
            delay={800}
            style={styles.progressContainer}>
            <View style={styles.progressSteps}>
              <View style={[styles.progressStep, styles.progressStepCompleted]}>
                <Text style={styles.progressStepText}>1</Text>
              </View>
              <View
                style={[
                  styles.progressLine,
                  verificationType === 'email' && styles.progressLineCompleted,
                ]}
              />
              <View
                style={[
                  styles.progressStep,
                  verificationType === 'email'
                    ? styles.progressStepActive
                    : styles.progressStepInactive,
                ]}>
                <Text
                  style={[
                    styles.progressStepText,
                    verificationType === 'email'
                      ? styles.progressStepTextActive
                      : styles.progressStepTextInactive,
                  ]}>
                  2
                </Text>
              </View>
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Mobile</Text>
              <Text style={styles.progressLabel}>Email</Text>
            </View>
          </Animatable.View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(40),
    alignItems: 'center',
  },
  title: {
    fontSize: verticalScale(28),
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: verticalScale(15),
  },
  subtitle: {
    fontSize: verticalScale(16),
    color: Colors.shadeGrey,
    textAlign: 'center',
    lineHeight: verticalScale(24),
    paddingHorizontal: horizontalScale(10),
  },
  otpContainer: {
    flex: 1,
    alignItems: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(30),
    paddingHorizontal: horizontalScale(10),
  },
  otpInput: {
    width: verticalScale(50),
    height: verticalScale(60),
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: verticalScale(24),
    fontWeight: 'bold',
    color: Colors.black,
    backgroundColor: Colors.white,
    marginHorizontal: horizontalScale(5),
  },
  otpInputFilled: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.borderLight,
  },
  resendContainer: {
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  timerText: {
    fontSize: verticalScale(16),
    color: Colors.shadeGrey,
    fontWeight: '500',
  },
  resendButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  resendText: {
    fontSize: verticalScale(16),
    color: Colors.primaryColor,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: verticalScale(30),
  },
  helpContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  helpText: {
    fontSize: verticalScale(14),
    color: Colors.shadeGrey,
    textAlign: 'center',
    lineHeight: verticalScale(20),
  },
  changeContactButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  changeContactText: {
    fontSize: verticalScale(14),
    color: Colors.primaryColor,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: verticalScale(50),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  progressStep: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  progressStepCompleted: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  progressStepActive: {
    backgroundColor: Colors.secondaryColor,
    borderColor: Colors.secondaryColor,
  },
  progressStepInactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderLight,
  },
  progressStepText: {
    fontSize: verticalScale(16),
    fontWeight: 'bold',
  },
  progressStepTextActive: {
    color: Colors.white,
  },
  progressStepTextInactive: {
    color: Colors.shadeGrey,
  },
  progressLine: {
    width: horizontalScale(60),
    height: 2,
    backgroundColor: Colors.borderLight,
    marginHorizontal: horizontalScale(10),
  },
  progressLineCompleted: {
    backgroundColor: Colors.primaryColor,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: horizontalScale(140),
  },
  progressLabel: {
    fontSize: verticalScale(12),
    color: Colors.shadeGrey,
    fontWeight: '500',
  },
});
