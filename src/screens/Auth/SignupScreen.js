import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../../constants/colors';
import CustomStatusBar from '../../components/CustomStatusBar';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import {horizontalScale, verticalScale} from '../../constants/helper';

// Sample country codes - in a real app, you'd have a more comprehensive list
const countryCodes = [
  {code: '+1', country: 'US', flag: '🇺🇸'},
  {code: '+44', country: 'UK', flag: '🇬🇧'},
  {code: '+91', country: 'IN', flag: '🇮🇳'},
  {code: '+86', country: 'CN', flag: '🇨🇳'},
  {code: '+81', country: 'JP', flag: '🇯🇵'},
  {code: '+49', country: 'DE', flag: '🇩🇪'},
  {code: '+33', country: 'FR', flag: '🇫🇷'},
  {code: '+39', country: 'IT', flag: '🇮🇹'},
  {code: '+34', country: 'ES', flag: '🇪🇸'},
  {code: '+7', country: 'RU', flag: '🇷🇺'},
  {code: '+55', country: 'BR', flag: '🇧🇷'},
  {code: '+52', country: 'MX', flag: '🇲🇽'},
  {code: '+61', country: 'AU', flag: '🇦🇺'},
  {code: '+27', country: 'ZA', flag: '🇿🇦'},
];

export default function SignupScreen({navigation}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0],
  );
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // First Name validation
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }

    // Username validation
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return false;
    }

    if (formData.username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return false;
    }

    if (formData.mobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return false;
    }

    // Password validation
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      Alert.alert('Error', 'Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to OTP verification for mobile first
      navigation.navigate('OTPVerificationScreen', {
        type: 'signup',
        mobile: `${selectedCountryCode.code}${formData.mobile}`,
        email: formData.email,
        verificationType: 'mobile',
        userData: {
          ...formData,
          countryCode: selectedCountryCode.code,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const selectCountryCode = country => {
    setSelectedCountryCode(country);
    setShowCountryModal(false);
  };

  const renderCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => selectCountryCode(item)}>
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
    </TouchableOpacity>
  );

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
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>
              Join the mining revolution today
            </Text>
          </Animatable.View>

          {/* Form Container */}
          <Animatable.View
            animation="fadeInUp"
            delay={300}
            duration={1000}
            style={styles.formContainer}>
            {/* Name Fields */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <InputField
                  placeholder="First name"
                  value={formData.firstName}
                  onChangeText={value => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Last Name *</Text>
                <InputField
                  placeholder="Last name"
                  value={formData.lastName}
                  onChangeText={value => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username *</Text>
              <InputField
                placeholder="Choose a username"
                value={formData.username}
                onChangeText={value => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <InputField
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Mobile Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <View style={styles.phoneContainer}>
                <TouchableOpacity
                  style={styles.countryCodeButton}
                  onPress={() => setShowCountryModal(true)}>
                  <Text style={styles.countryCodeFlag}>
                    {selectedCountryCode.flag}
                  </Text>
                  <Text style={styles.countryCodeText}>
                    {selectedCountryCode.code}
                  </Text>
                </TouchableOpacity>
                <View style={styles.phoneInputContainer}>
                  <InputField
                    placeholder="Mobile number"
                    value={formData.mobile}
                    onChangeText={value => handleInputChange('mobile', value)}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                  />
                </View>
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password *</Text>
              <InputField
                placeholder="Create a password"
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <InputField
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={value =>
                  handleInputChange('confirmPassword', value)
                }
                secureTextEntry={!showConfirmPassword}
                rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Signup Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
              />
            </View>

            {/* Login Link */}
            <Animatable.View
              animation="fadeInUp"
              delay={600}
              style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink} onPress={navigateToLogin}>
                  Sign In
                </Text>
              </Text>
            </Animatable.View>
          </Animatable.View>
        </ScrollView>

        {/* Country Code Modal */}
        <Modal
          visible={showCountryModal}
          animationType="slide"
          presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCountryModal(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryCodes}
              renderItem={renderCountryItem}
              keyExtractor={item => item.code}
              style={styles.countryList}
            />
          </View>
        </Modal>
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
    marginBottom: verticalScale(30),
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  halfWidth: {
    width: '48%',
  },
  inputLabel: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(8),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    borderRadius: 8,
    marginRight: horizontalScale(10),
    minWidth: horizontalScale(80),
  },
  countryCodeFlag: {
    fontSize: verticalScale(18),
    marginRight: horizontalScale(5),
  },
  countryCodeText: {
    fontSize: verticalScale(16),
    fontWeight: '500',
    color: Colors.black,
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    marginBottom: 0,
  },
  termsContainer: {
    marginBottom: verticalScale(20),
  },
  termsText: {
    fontSize: verticalScale(14),
    color: Colors.shadeGrey,
    textAlign: 'center',
    lineHeight: verticalScale(20),
  },
  termsLink: {
    color: Colors.primaryColor,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: verticalScale(20),
  },
  loginContainer: {
    alignItems: 'center',
    paddingBottom: verticalScale(30),
  },
  loginText: {
    fontSize: verticalScale(16),
    color: Colors.shadeGrey,
    textAlign: 'center',
  },
  loginLink: {
    color: Colors.primaryColor,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: verticalScale(18),
    fontWeight: 'bold',
    color: Colors.black,
  },
  modalCloseButton: {
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(5),
  },
  modalCloseText: {
    fontSize: verticalScale(16),
    color: Colors.primaryColor,
    fontWeight: '500',
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  countryFlag: {
    fontSize: verticalScale(20),
    marginRight: horizontalScale(15),
  },
  countryCode: {
    fontSize: verticalScale(16),
    fontWeight: '500',
    color: Colors.black,
    marginRight: horizontalScale(15),
    minWidth: horizontalScale(50),
  },
  countryName: {
    fontSize: verticalScale(16),
    color: Colors.shadeGrey,
  },
});
