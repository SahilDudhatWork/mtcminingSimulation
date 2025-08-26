import React, { useEffect } from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { LogBox } from 'react-native'

export default function App() {

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, [])

  return (
    <AppNavigator />
  )
}