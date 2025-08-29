import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import adManager from './src/utils/adManager';

export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs();

    // Initialize AdMob when app starts
    adManager.initializeAds();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
      <Toast />
    </AuthProvider>
  );
}
