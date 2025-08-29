import Toast from 'react-native-toast-message';

/**
 * Utility functions for showing toast messages throughout the app
 * Replaces Alert.alert with non-blocking toast notifications
 */

export const showToast = {
  success: (title, message = '') => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  },

  error: (title, message = '') => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  },

  info: (title, message = '') => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  },

  // For simple text-only messages
  show: (text, type = 'info') => {
    Toast.show({
      type,
      text1: text,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
};

// Backwards compatibility with Alert.alert pattern
export const showAlert = (title, message, type = 'info') => {
  if (type === 'success' || title.toLowerCase().includes('success')) {
    showToast.success(title, message);
  } else if (type === 'error' || title.toLowerCase().includes('error')) {
    showToast.error(title, message);
  } else {
    showToast.info(title, message);
  }
};

export default showToast;
