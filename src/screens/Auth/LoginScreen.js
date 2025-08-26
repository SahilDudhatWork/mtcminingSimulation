import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../../constants/colors';
import CustomStatusBar from '../../components/CustomStatusBar';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import {horizontalScale, verticalScale} from '../../constants/helper';

export default function LoginScreen({navigation}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, any valid email/password combination will work
      // In a real app, you would make an actual API call here

      // Navigate to OTP verification for email
      navigation.navigate('OTPVerificationScreen', {
        type: 'login',
        email: formData.email,
        verificationType: 'email',
      });
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignupScreen');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented here.',
      [{text: 'OK'}],
    );
  };

  return (
    <>
      <CustomStatusBar dark backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>
              Sign in to continue your mining journey
            </Text>
          </Animatable.View>

          {/* Form Container */}
          <Animatable.View
            animation="fadeInUp"
            delay={300}
            duration={1000}
            style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <InputField
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <InputField
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Options */}
            <Animatable.View
              animation="fadeInUp"
              delay={600}
              style={styles.socialContainer}>
              <Text style={styles.socialText}>
                Continue with social accounts
              </Text>
              {/* Social buttons would go here */}
            </Animatable.View>

            {/* Sign Up Link */}
            <Animatable.View
              animation="fadeInUp"
              delay={800}
              style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink} onPress={navigateToSignup}>
                  Sign Up
                </Text>
              </Text>
            </Animatable.View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(40),
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: verticalScale(32),
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  subtitleText: {
    fontSize: verticalScale(16),
    color: Colors.shadeGrey,
    textAlign: 'center',
    lineHeight: verticalScale(24),
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(8),
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(30),
  },
  forgotPasswordText: {
    fontSize: verticalScale(14),
    color: Colors.primaryColor,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: verticalScale(30),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    fontSize: verticalScale(14),
    color: Colors.shadeGrey,
    marginHorizontal: horizontalScale(15),
    fontWeight: '500',
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  socialText: {
    fontSize: verticalScale(14),
    color: Colors.shadeGrey,
    textAlign: 'center',
  },
  signupContainer: {
    alignItems: 'center',
    paddingBottom: verticalScale(30),
  },
  signupText: {
    fontSize: verticalScale(16),
    color: Colors.shadeGrey,
    textAlign: 'center',
  },
  signupLink: {
    color: Colors.primaryColor,
    fontWeight: '600',
  },
});
