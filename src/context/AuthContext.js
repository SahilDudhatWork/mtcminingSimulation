import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setUser(parsed);
        setIsLoggedIn(true);
      }

      const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
      setOnboardingCompleted(onboardingStatus === 'true');
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://peradox.in/api/mtc/login', { email, password });

      if (res.data?.status === 'success') {
        const userData = res.data.data.user;
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
        await completeOnboarding();
        return { success: true };
      } else {
        return { success: false, message: res.data?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const signup = async (name, email, password, refer_code) => {
    try {
      const payload = { name, email, password };
      if (refer_code) payload.refer_code = refer_code;

      const res = await axios.post('https://peradox.in/api/mtc/register', payload);

      if (res.data?.status === 'success') {
        const userData = res.data.data.user;
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
        await completeOnboarding();
        return { success: true };
      } else {
        return { success: false, message: res.data?.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup API error:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Onboarding error:', error);
    }
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        onboardingCompleted,
        login,
        signup,
        logout,
        completeOnboarding,
        getInitialRoute,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
