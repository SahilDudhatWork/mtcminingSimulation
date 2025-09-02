import OneSignal from 'react-native-onesignal';
import {Alert} from 'react-native';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.userId = null;
  }

  // Initialize OneSignal with your App ID
  initialize(appId) {
    if (this.isInitialized) return;

    try {
      // Initialize OneSignal
      OneSignal.setAppId(appId);

      // Set up notification handlers
      this.setupNotificationHandlers();

      // Request notification permissions
      this.requestPermissions();

      this.isInitialized = true;
      console.log('OneSignal initialized successfully');
    } catch (error) {
      console.error('Error initializing OneSignal:', error);
    }
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      const deviceState = await OneSignal.getDeviceState();
      console.log('Device state:', deviceState);
      
      if (!deviceState.hasNotificationPermission) {
        OneSignal.promptForPushNotificationsWithUserResponse((response) => {
          console.log('Prompt response:', response);
        });
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  }

  // Set up notification event handlers
  setupNotificationHandlers() {
    // Handle notification received while app is in foreground
    OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
      console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log('notification: ', notification);
      
      // Complete with null means don't show a notification
      // Complete with notification means show the notification
      notificationReceivedEvent.complete(notification);
    });

    // Handle notification opened
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log('OneSignal: notification opened:', notification);
      this.handleNotificationOpened(notification);
    });

    // Handle subscription changes
    OneSignal.addSubscriptionObserver((event) => {
      console.log('OneSignal: subscription changed: ', event);
      this.userId = event.to.userId;
    });

    // Handle permission changes
    OneSignal.addPermissionObserver((event) => {
      console.log('OneSignal: permission changed:', event);
    });
  }

  // Handle when notification is opened/clicked
  handleNotificationOpened(openResult) {
    try {
      const { notification } = openResult;
      const data = notification.additionalData;
      
      console.log('Notification opened with data:', data);
      
      // Handle different notification types based on data
      if (data) {
        switch (data.type) {
          case 'mining_reward':
            this.handleMiningRewardNotification(data);
            break;
          case 'boost_available':
            this.handleBoostNotification(data);
            break;
          case 'daily_bonus':
            this.handleDailyBonusNotification(data);
            break;
          case 'referral_reward':
            this.handleReferralNotification(data);
            break;
          default:
            console.log('Unknown notification type:', data.type);
        }
      }
    } catch (error) {
      console.error('Error handling notification opened:', error);
    }
  }

  // Handle mining reward notifications
  handleMiningRewardNotification(data) {
    console.log('Handling mining reward notification:', data);
    // Navigate to mining screen or show reward modal
  }

  // Handle boost available notifications
  handleBoostNotification(data) {
    console.log('Handling boost notification:', data);
    // Navigate to boost screen or show boost modal
  }

  // Handle daily bonus notifications
  handleDailyBonusNotification(data) {
    console.log('Handling daily bonus notification:', data);
    // Navigate to daily bonus screen
  }

  // Handle referral notifications
  handleReferralNotification(data) {
    console.log('Handling referral notification:', data);
    // Navigate to referral screen
  }

  // Get user ID for targeting notifications
  async getUserId() {
    try {
      const deviceState = await OneSignal.getDeviceState();
      return deviceState.userId;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  // Set external user ID (for targeting specific users)
  setExternalUserId(externalId) {
    try {
      OneSignal.setExternalUserId(externalId, (results) => {
        console.log('External user ID set:', results);
      });
    } catch (error) {
      console.error('Error setting external user ID:', error);
    }
  }

  // Add tags for user segmentation
  sendTags(tags) {
    try {
      OneSignal.sendTags(tags);
      console.log('Tags sent:', tags);
    } catch (error) {
      console.error('Error sending tags:', error);
    }
  }

  // Send notification to specific user (requires REST API)
  async sendNotificationToUser(userId, title, message, data = {}) {
    try {
      // This would typically be done from your backend
      // Here's the structure for reference
      const notificationData = {
        app_id: 'YOUR_ONESIGNAL_APP_ID',
        include_player_ids: [userId],
        headings: { en: title },
        contents: { en: message },
        data: data,
      };
      
      console.log('Notification data prepared:', notificationData);
      // You would send this to OneSignal REST API from your backend
      
    } catch (error) {
      console.error('Error preparing notification:', error);
    }
  }

  // Send notification to all users (requires REST API)
  async sendNotificationToAll(title, message, data = {}) {
    try {
      const notificationData = {
        app_id: 'YOUR_ONESIGNAL_APP_ID',
        included_segments: ['All'],
        headings: { en: title },
        contents: { en: message },
        data: data,
      };
      
      console.log('Broadcast notification data prepared:', notificationData);
      // You would send this to OneSignal REST API from your backend
      
    } catch (error) {
      console.error('Error preparing broadcast notification:', error);
    }
  }

  // Get notification permission status
  async getPermissionStatus() {
    try {
      const deviceState = await OneSignal.getDeviceState();
      return {
        hasPermission: deviceState.hasNotificationPermission,
        isSubscribed: deviceState.isSubscribed,
        userId: deviceState.userId,
      };
    } catch (error) {
      console.error('Error getting permission status:', error);
      return {
        hasPermission: false,
        isSubscribed: false,
        userId: null,
      };
    }
  }

  // Disable notifications
  disableNotifications() {
    try {
      OneSignal.disablePush(true);
      console.log('Notifications disabled');
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  }

  // Enable notifications
  enableNotifications() {
    try {
      OneSignal.disablePush(false);
      console.log('Notifications enabled');
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
