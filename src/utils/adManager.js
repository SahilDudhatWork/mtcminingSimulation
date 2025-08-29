import mobileAds, {
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

class AdManager {
  constructor() {
    this.interstitialAd = null;
    this.rewardedAd = null;
    this.isTestMode = __DEV__; // Use test ads in development

    // Test ad unit IDs - replace with your actual ad unit IDs for production
    this.adUnitIds = {
      interstitial: this.isTestMode
        ? TestIds.INTERSTITIAL
        : 'YOUR_INTERSTITIAL_AD_UNIT_ID',
      rewarded: this.isTestMode ? TestIds.REWARDED : 'YOUR_REWARDED_AD_UNIT_ID',
    };

    this.initializeAds();
  }

  async initializeAds() {
    try {
      await mobileAds().initialize();
      console.log('AdMob initialized successfully');
      this.loadInterstitialAd();
      this.loadRewardedAd();
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  loadInterstitialAd() {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(
        this.adUnitIds.interstitial,
      );

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
        console.error('Interstitial ad failed to load:', error);
        // Reload the ad after a delay
        setTimeout(() => this.loadInterstitialAd(), 5000);
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        // Reload the ad for next time
        this.loadInterstitialAd();
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('Error creating interstitial ad:', error);
    }
  }

  loadRewardedAd() {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(this.adUnitIds.rewarded);

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, error => {
        console.error('Rewarded ad failed to load:', error);
        // Reload the ad after a delay
        setTimeout(() => this.loadRewardedAd(), 5000);
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        console.log('Rewarded ad closed');
        // Reload the ad for next time
        this.loadRewardedAd();
      });

      this.rewardedAd.load();
    } catch (error) {
      console.error('Error creating rewarded ad:', error);
    }
  }

  async showInterstitialAd() {
    try {
      if (this.interstitialAd && this.interstitialAd.loaded) {
        await this.interstitialAd.show();
        return true;
      } else {
        console.log('Interstitial ad not loaded yet');
        // Try to load the ad
        this.loadInterstitialAd();
        return false;
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }

  async showRewardedAd() {
    return new Promise(resolve => {
      try {
        if (this.rewardedAd && this.rewardedAd.loaded) {
          // Set up reward listener
          const unsubscribeEarned = this.rewardedAd.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
              console.log('User earned reward:', reward);
              resolve({success: true, reward});
              unsubscribeEarned();
            },
          );

          // Set up close listener
          const unsubscribeClosed = this.rewardedAd.addAdEventListener(
            RewardedAdEventType.CLOSED,
            () => {
              console.log('Rewarded ad closed without reward');
              resolve({success: false, reward: null});
              unsubscribeClosed();
            },
          );

          this.rewardedAd.show();
        } else {
          console.log('Rewarded ad not loaded yet');
          // Try to load the ad
          this.loadRewardedAd();
          resolve({success: false, reward: null});
        }
      } catch (error) {
        console.error('Error showing rewarded ad:', error);
        resolve({success: false, reward: null});
      }
    });
  }

  // Check if ads are loaded and ready
  isInterstitialReady() {
    return this.interstitialAd && this.interstitialAd.loaded;
  }

  isRewardedReady() {
    return this.rewardedAd && this.rewardedAd.loaded;
  }
}

// Create a singleton instance
const adManager = new AdManager();

export default adManager;
