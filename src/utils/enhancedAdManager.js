import mobileAds, {
  InterstitialAd,
  RewardedAd,
  TestIds,
  AdEventType,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import {
  InterstitialAd as FBInterstitialAd,
  RewardedVideoAd as FBRewardedAd,
  AdSettings,
} from 'react-native-fbads';
import {
  MaxInterstitialAd,
  MaxRewardedAd,
  MaxAdView,
} from 'react-native-applovin-max';
import adConfigService from '../services/adConfigService';

const AD_NETWORKS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  APPLOVIN: 'applovin',
};

class EnhancedAdManager {
  constructor() {
    this.isInitialized = false;
    this.currentConfig = null;
    this.adInstances = {
      google: { interstitial: null, rewarded: null },
      facebook: { interstitial: null, rewarded: null },
      applovin: { interstitial: null, rewarded: null },
    };
    this.adCounts = {
      interstitial: 0,
      rewarded: 0,
    };
    this.lastAdTimes = {
      interstitial: 0,
      rewarded: 0,
    };
  }

  // Initialize all ad networks with backend config
  async initializeAds() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing enhanced ad manager...');
      
      // Fetch configuration from backend
      this.currentConfig = await adConfigService.fetchAdConfig();
      
      // Initialize each enabled network
      await this.initializeGoogleAds();
      
      if (this.currentConfig.networks?.facebook?.enabled) {
        await this.initializeFacebookAds();
      }
      
      if (this.currentConfig.networks?.applovin?.enabled) {
        await this.initializeAppLovinAds();
      }
      
      this.isInitialized = true;
      console.log('Enhanced ad manager initialized successfully');
      
      // Set up periodic config refresh
      this.setupConfigRefresh();
      
    } catch (error) {
      console.error('Error initializing enhanced ad manager:', error);
    }
  }

  // Setup periodic config refresh
  setupConfigRefresh() {
    const refreshInterval = this.currentConfig?.refreshInterval || 300000; // 5 minutes default
    
    setInterval(async () => {
      try {
        console.log('Refreshing ad config...');
        const newConfig = await adConfigService.fetchAdConfig();
        
        if (JSON.stringify(newConfig) !== JSON.stringify(this.currentConfig)) {
          console.log('Ad config changed, updating...');
          this.currentConfig = newConfig;
          await this.reinitializeAds();
        }
      } catch (error) {
        console.error('Error refreshing ad config:', error);
      }
    }, refreshInterval);
  }

  // Reinitialize ads when config changes
  async reinitializeAds() {
    try {
      // Clear existing instances
      this.clearAllAds();
      
      // Reinitialize based on new config
      await this.initializeGoogleAds();
      
      if (this.currentConfig.networks?.facebook?.enabled) {
        await this.initializeFacebookAds();
      }
      
      if (this.currentConfig.networks?.applovin?.enabled) {
        await this.initializeAppLovinAds();
      }
      
      console.log('Ads reinitialized with new config');
    } catch (error) {
      console.error('Error reinitializing ads:', error);
    }
  }

  // Clear all ad instances
  clearAllAds() {
    Object.keys(this.adInstances).forEach(network => {
      this.adInstances[network] = { interstitial: null, rewarded: null };
    });
  }

  // Initialize Google Ads
  async initializeGoogleAds() {
    try {
      await mobileAds().initialize();
      console.log('Google Ads initialized');
      
      if (this.currentConfig.networks?.google?.enabled) {
        this.loadGoogleInterstitial();
        this.loadGoogleRewarded();
      }
    } catch (error) {
      console.error('Error initializing Google Ads:', error);
    }
  }

  // Initialize Facebook Ads
  async initializeFacebookAds() {
    try {
      if (__DEV__) {
        AdSettings.addTestDevice(AdSettings.currentDeviceHash);
      }
      
      this.loadFacebookInterstitial();
      this.loadFacebookRewarded();
      console.log('Facebook Ads initialized');
    } catch (error) {
      console.error('Error initializing Facebook Ads:', error);
    }
  }

  // Initialize AppLovin Ads
  async initializeAppLovinAds() {
    try {
      // AppLovin initialization
      console.log('AppLovin Ads initialized');
      this.loadAppLovinInterstitial();
      this.loadAppLovinRewarded();
    } catch (error) {
      console.error('Error initializing AppLovin Ads:', error);
    }
  }

  // Load Google Ads
  loadGoogleInterstitial() {
    try {
      const adUnitId = this.currentConfig?.networks?.google?.interstitialId || TestIds.INTERSTITIAL;
      
      this.adInstances.google.interstitial = InterstitialAd.createForAdRequest(adUnitId);
      
      this.adInstances.google.interstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Google Interstitial loaded');
      });
      
      this.adInstances.google.interstitial.addAdEventListener(AdEventType.ERROR, error => {
        console.error('Google Interstitial error:', error);
        setTimeout(() => this.loadGoogleInterstitial(), 5000);
      });
      
      this.adInstances.google.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        this.loadGoogleInterstitial();
      });
      
      this.adInstances.google.interstitial.load();
    } catch (error) {
      console.error('Error loading Google interstitial:', error);
    }
  }

  loadGoogleRewarded() {
    try {
      const adUnitId = this.currentConfig?.networks?.google?.rewardedId || TestIds.REWARDED;
      
      this.adInstances.google.rewarded = RewardedAd.createForAdRequest(adUnitId);
      
      this.adInstances.google.rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Google Rewarded loaded');
      });
      
      this.adInstances.google.rewarded.addAdEventListener(AdEventType.ERROR, error => {
        console.error('Google Rewarded error:', error);
        setTimeout(() => this.loadGoogleRewarded(), 5000);
      });
      
      this.adInstances.google.rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        this.loadGoogleRewarded();
      });
      
      this.adInstances.google.rewarded.load();
    } catch (error) {
      console.error('Error loading Google rewarded:', error);
    }
  }

  // Load Facebook Ads
  loadFacebookInterstitial() {
    try {
      const adUnitId = this.currentConfig?.networks?.facebook?.interstitialId || 'YOUR_FB_INTERSTITIAL_ID';
      this.adInstances.facebook.interstitial = new FBInterstitialAd(adUnitId);
      this.adInstances.facebook.interstitial.loadAd();
      console.log('Facebook Interstitial loading...');
    } catch (error) {
      console.error('Error loading Facebook interstitial:', error);
    }
  }

  loadFacebookRewarded() {
    try {
      const adUnitId = this.currentConfig?.networks?.facebook?.rewardedId || 'YOUR_FB_REWARDED_ID';
      this.adInstances.facebook.rewarded = new FBRewardedAd(adUnitId);
      this.adInstances.facebook.rewarded.loadAd();
      console.log('Facebook Rewarded loading...');
    } catch (error) {
      console.error('Error loading Facebook rewarded:', error);
    }
  }

  // Load AppLovin Ads
  loadAppLovinInterstitial() {
    try {
      const adUnitId = this.currentConfig?.networks?.applovin?.interstitialId || 'YOUR_APPLOVIN_INTERSTITIAL_ID';
      this.adInstances.applovin.interstitial = new MaxInterstitialAd(adUnitId);
      this.adInstances.applovin.interstitial.loadAd();
      console.log('AppLovin Interstitial loading...');
    } catch (error) {
      console.error('Error loading AppLovin interstitial:', error);
    }
  }

  loadAppLovinRewarded() {
    try {
      const adUnitId = this.currentConfig?.networks?.applovin?.rewardedId || 'YOUR_APPLOVIN_REWARDED_ID';
      this.adInstances.applovin.rewarded = new MaxRewardedAd(adUnitId);
      this.adInstances.applovin.rewarded.loadAd();
      console.log('AppLovin Rewarded loading...');
    } catch (error) {
      console.error('Error loading AppLovin rewarded:', error);
    }
  }

  // Check ad frequency limits
  canShowAd(adType) {
    const now = Date.now();
    const lastTime = this.lastAdTimes[adType] || 0;
    const count = this.adCounts[adType] || 0;
    
    const config = this.currentConfig?.adFrequency?.[adType];
    if (!config) return true;
    
    // Check time interval
    if (config.minInterval && (now - lastTime) < config.minInterval) {
      console.log(`Ad ${adType} blocked by time interval`);
      return false;
    }
    
    // Check session count
    if (config.maxPerSession && count >= config.maxPerSession) {
      console.log(`Ad ${adType} blocked by session limit`);
      return false;
    }
    
    return true;
  }

  // Record ad shown
  recordAdShown(adType) {
    this.lastAdTimes[adType] = Date.now();
    this.adCounts[adType] = (this.adCounts[adType] || 0) + 1;
  }

  // Get priority order of networks to try
  getNetworkPriorityOrder() {
    if (!this.currentConfig?.networks) {
      return [AD_NETWORKS.GOOGLE];
    }

    return Object.entries(this.currentConfig.networks)
      .filter(([_, config]) => config.enabled)
      .sort(([_, a], [__, b]) => (a.priority || 999) - (b.priority || 999))
      .map(([network, _]) => network);
  }

  // Universal show interstitial with fallback
  async showInterstitialAd() {
    try {
      if (!this.canShowAd('interstitial')) {
        return { success: false, reason: 'frequency_limit' };
      }

      const networks = this.getNetworkPriorityOrder();
      
      for (const network of networks) {
        try {
          console.log(`Trying to show interstitial with ${network}...`);
          const result = await this.showInterstitialByNetwork(network);
          
          if (result.success) {
            this.recordAdShown('interstitial');
            console.log(`Interstitial shown successfully with ${network}`);
            return { success: true, network };
          }
        } catch (error) {
          console.log(`${network} interstitial failed, trying next...`);
        }
      }
      
      console.log('All interstitial networks failed');
      return { success: false, reason: 'all_networks_failed' };
      
    } catch (error) {
      console.error('Error in showInterstitialAd:', error);
      return { success: false, reason: 'error' };
    }
  }

  // Universal show rewarded with fallback
  async showRewardedAd() {
    try {
      if (!this.canShowAd('rewarded')) {
        return { success: false, reason: 'frequency_limit' };
      }

      const networks = this.getNetworkPriorityOrder();
      
      for (const network of networks) {
        try {
          console.log(`Trying to show rewarded with ${network}...`);
          const result = await this.showRewardedByNetwork(network);
          
          if (result.success) {
            this.recordAdShown('rewarded');
            console.log(`Rewarded ad shown successfully with ${network}`);
            return { ...result, network };
          }
        } catch (error) {
          console.log(`${network} rewarded failed, trying next...`);
        }
      }
      
      console.log('All rewarded networks failed');
      return { success: false, reason: 'all_networks_failed' };
      
    } catch (error) {
      console.error('Error in showRewardedAd:', error);
      return { success: false, reason: 'error' };
    }
  }

  // Show interstitial by specific network
  async showInterstitialByNetwork(network) {
    switch (network) {
      case AD_NETWORKS.GOOGLE:
        return await this.showGoogleInterstitial();
      case AD_NETWORKS.FACEBOOK:
        return await this.showFacebookInterstitial();
      case AD_NETWORKS.APPLOVIN:
        return await this.showAppLovinInterstitial();
      default:
        throw new Error(`Unknown network: ${network}`);
    }
  }

  // Show rewarded by specific network
  async showRewardedByNetwork(network) {
    switch (network) {
      case AD_NETWORKS.GOOGLE:
        return await this.showGoogleRewarded();
      case AD_NETWORKS.FACEBOOK:
        return await this.showFacebookRewarded();
      case AD_NETWORKS.APPLOVIN:
        return await this.showAppLovinRewarded();
      default:
        throw new Error(`Unknown network: ${network}`);
    }
  }

  // Google Ad Show Methods
  async showGoogleInterstitial() {
    return new Promise(resolve => {
      try {
        const ad = this.adInstances.google.interstitial;
        if (ad && ad.loaded) {
          ad.show();
          resolve({ success: true });
        } else {
          this.loadGoogleInterstitial();
          resolve({ success: false, reason: 'not_loaded' });
        }
      } catch (error) {
        console.error('Google interstitial error:', error);
        resolve({ success: false, reason: 'error' });
      }
    });
  }

  async showGoogleRewarded() {
    return new Promise(resolve => {
      try {
        const ad = this.adInstances.google.rewarded;
        if (!ad || !ad.loaded) {
          this.loadGoogleRewarded();
          resolve({ success: false, reason: 'not_loaded' });
          return;
        }

        let earned = false;

        const rewardListener = ad.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          reward => {
            earned = true;
            resolve({ success: true, reward });
          }
        );

        const closedListener = ad.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            if (!earned) resolve({ success: false, reason: 'not_completed' });
            rewardListener();
            closedListener();
          }
        );

        ad.show();
      } catch (error) {
        console.error('Google rewarded error:', error);
        resolve({ success: false, reason: 'error' });
      }
    });
  }

  // Facebook Ad Show Methods
  async showFacebookInterstitial() {
    return new Promise(resolve => {
      try {
        const ad = this.adInstances.facebook.interstitial;
        if (!ad) {
          this.loadFacebookInterstitial();
          resolve({ success: false, reason: 'not_loaded' });
          return;
        }

        ad.showAd()
          .then(() => {
            resolve({ success: true });
          })
          .catch(error => {
            console.error('Facebook interstitial error:', error);
            resolve({ success: false, reason: 'error' });
          });
      } catch (error) {
        console.error('Facebook interstitial error:', error);
        resolve({ success: false, reason: 'error' });
      }
    });
  }

  async showFacebookRewarded() {
    return new Promise(resolve => {
      try {
        const ad = this.adInstances.facebook.rewarded;
        if (!ad) {
          this.loadFacebookRewarded();
          resolve({ success: false, reason: 'not_loaded' });
          return;
        }

        ad.showAd()
          .then(() => {
            resolve({ success: true, reward: { amount: 1, type: 'coins' } });
          })
          .catch(error => {
            console.error('Facebook rewarded error:', error);
            resolve({ success: false, reason: 'error' });
          });
      } catch (error) {
        console.error('Facebook rewarded error:', error);
        resolve({ success: false, reason: 'error' });
      }
    });
  }

  // AppLovin Ad Show Methods
  async showAppLovinInterstitial() {
    return new Promise(resolve => {
      try {
        const ad = this.adInstances.applovin.interstitial;
        if (!ad) {
          this.loadAppLovinInterstitial();
          resolve({ success: false, reason: 'not_loaded' });
          return;
        }

        ad.showAd()
          .then(() => {
            resolve({ success: true });
          })
          .catch(error => {
            console.error('AppLovin interstitial error:', error);
            resolve({ success: false, reason: 'error' });
          });
      } catch (error) {
        console.error('AppLovin interstitial error:', error);
        resolve({ success: false, reason: 'error' });
      }
    });
  }

  async showAppLovinRewarded() {
    return new Promise(resolve => {
      try {
        const ad = this.adInstances.applovin.rewarded;
        if (!ad) {
          this.loadAppLovinRewarded();
          resolve({ success: false, reason: 'not_loaded' });
          return;
        }

        ad.showAd()
          .then(() => {
            resolve({ success: true, reward: { amount: 1, type: 'coins' } });
          })
          .catch(error => {
            console.error('AppLovin rewarded error:', error);
            resolve({ success: false, reason: 'error' });
          });
      } catch (error) {
        console.error('AppLovin rewarded error:', error);
        resolve({ success: false, reason: 'error' });
      }
    });
  }

  // Check if any interstitial is ready
  isInterstitialReady() {
    const networks = this.getNetworkPriorityOrder();
    
    for (const network of networks) {
      const ad = this.adInstances[network]?.interstitial;
      
      switch (network) {
        case AD_NETWORKS.GOOGLE:
          if (ad && ad.loaded) return true;
          break;
        case AD_NETWORKS.FACEBOOK:
        case AD_NETWORKS.APPLOVIN:
          if (ad) return true;
          break;
      }
    }
    
    return false;
  }

  // Check if any rewarded is ready
  isRewardedReady() {
    const networks = this.getNetworkPriorityOrder();
    
    for (const network of networks) {
      const ad = this.adInstances[network]?.rewarded;
      
      switch (network) {
        case AD_NETWORKS.GOOGLE:
          if (ad && ad.loaded) return true;
          break;
        case AD_NETWORKS.FACEBOOK:
        case AD_NETWORKS.APPLOVIN:
          if (ad) return true;
          break;
      }
    }
    
    return false;
  }

  // Get current ad status
  getAdStatus() {
    return {
      config: this.currentConfig,
      networks: this.getNetworkPriorityOrder(),
      ready: {
        interstitial: this.isInterstitialReady(),
        rewarded: this.isRewardedReady(),
      },
      counts: this.adCounts,
      lastShown: this.lastAdTimes,
    };
  }

  // Force refresh config from backend
  async refreshConfig() {
    try {
      this.currentConfig = await adConfigService.refreshConfig();
      await this.reinitializeAds();
      console.log('Ad config refreshed successfully');
    } catch (error) {
      console.error('Error refreshing ad config:', error);
    }
  }
}

// Singleton instance
const enhancedAdManager = new EnhancedAdManager();

export default enhancedAdManager;
