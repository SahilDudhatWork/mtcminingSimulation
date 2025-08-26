import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Check if user is logged in
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsLoggedIn(true);
      }

      // Check if onboarding is completed
      const onboardingStatus = await AsyncStorage.getItem(
        'onboardingCompleted',
      );
      setOnboardingCompleted(onboardingStatus === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async userData => {
    try {
      const userDataToStore = {
        ...userData,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
      setUser(userDataToStore);
      setIsLoggedIn(true);

      return {success: true};
    } catch (error) {
      console.error('Error during login:', error);
      return {success: false, error: 'Failed to save login data'};
    }
  };

  const signup = async userData => {
    try {
      const userDataToStore = {
        ...userData,
        isLoggedIn: true,
        signupTime: new Date().toISOString(),
        verifiedMobile: true,
        verifiedEmail: true,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
      setUser(userDataToStore);
      setIsLoggedIn(true);

      return {success: true};
    } catch (error) {
      console.error('Error during signup:', error);
      return {success: false, error: 'Failed to save signup data'};
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsLoggedIn(false);

      return {success: true};
    } catch (error) {
      console.error('Error during logout:', error);
      return {success: false, error: 'Failed to logout'};
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setOnboardingCompleted(true);

      return {success: true};
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return {success: false, error: 'Failed to complete onboarding'};
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboardingCompleted');
      setOnboardingCompleted(false);

      return {success: true};
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      return {success: false, error: 'Failed to reset onboarding'};
    }
  };

  const updateUser = async updatedData => {
    try {
      const currentUserData = await AsyncStorage.getItem('userData');
      if (currentUserData) {
        const parsedUserData = JSON.parse(currentUserData);
        const newUserData = {...parsedUserData, ...updatedData};

        await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
        setUser(newUserData);

        return {success: true};
      }
      return {success: false, error: 'No user data found'};
    } catch (error) {
      console.error('Error updating user:', error);
      return {success: false, error: 'Failed to update user data'};
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove(['userData', 'onboardingCompleted']);
      setUser(null);
      setIsLoggedIn(false);
      setOnboardingCompleted(false);

      return {success: true};
    } catch (error) {
      console.error('Error clearing all data:', error);
      return {success: false, error: 'Failed to clear data'};
    }
  };

  // Helper functions for authentication checks
  const isAuthenticated = () => {
    return isLoggedIn && user;
  };

  const isFirstTime = () => {
    return !onboardingCompleted;
  };

  const getUserData = () => {
    return user;
  };

  const getInitialRoute = () => {
    if (isLoading) {
      return 'SplashScreen';
    }

    if (!onboardingCompleted) {
      return 'OnBoardingScreen';
    }

    if (!isLoggedIn) {
      return 'LoginScreen';
    }

    return 'BottomTab';
  };

  const value = {
    // State
    user,
    isLoading,
    isLoggedIn,
    onboardingCompleted,

    // Auth methods
    login,
    signup,
    logout,
    completeOnboarding,
    resetOnboarding,
    updateUser,
    clearAllData,
    checkAuthStatus,

    // Helper methods
    isAuthenticated,
    isFirstTime,
    getUserData,
    getInitialRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
