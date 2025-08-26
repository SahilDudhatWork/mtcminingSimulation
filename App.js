import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {LogBox} from 'react-native';

export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
