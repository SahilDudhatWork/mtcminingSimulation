import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import adManager from './src/utils/adManager';
import enhancedAdManager from './src/utils/enhancedAdManager';
import notificationService from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs();

    // Initialize Enhanced Ad Manager (supports Google, Facebook, AppLovin)
    enhancedAdManager.initializeAds();

    // Initialize OneSignal notifications
    // Replace 'YOUR_ONESIGNAL_APP_ID' with your actual OneSignal App ID
    notificationService.initialize('YOUR_ONESIGNAL_APP_ID');
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
