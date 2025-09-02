import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AdConfigService {
  constructor() {
    this.cachedConfig = null;
    this.lastFetchTime = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  // Fetch ad configuration from backend
  async fetchAdConfig() {
    try {
      // Check if we have cached config that's still valid
      if (this.cachedConfig && this.lastFetchTime && 
          (Date.now() - this.lastFetchTime) < this.cacheExpiry) {
        console.log('Using cached ad config');
        return this.cachedConfig;
      }

      console.log('Fetching fresh ad config from backend...');
      const response = await axios.get('https://peradox.in/api/mtc/getAdConfig');
      
      if (response.data && response.data.status === 'success') {
        const config = response.data.data;
        
        // Cache the config
        this.cachedConfig = config;
        this.lastFetchTime = Date.now();
        
        // Store in AsyncStorage for offline access
        await AsyncStorage.setItem('adConfig', JSON.stringify(config));
        
        console.log('Ad config fetched successfully:', config);
        return config;
      } else {
        throw new Error('Invalid response from ad config API');
      }
    } catch (error) {
      console.error('Error fetching ad config:', error);
      
      // Try to load from AsyncStorage as fallback
      const cachedConfig = await this.loadCachedConfig();
      if (cachedConfig) {
        console.log('Using stored ad config as fallback');
        return cachedConfig;
      }
      
      // Return default config if all else fails
      return this.getDefaultConfig();
    }
  }

  // Load cached config from AsyncStorage
  async loadCachedConfig() {
    try {
      const stored = await AsyncStorage.getItem('adConfig');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading cached ad config:', error);
    }
    return null;
  }

  // Default configuration
  getDefaultConfig() {
    return {
      activeNetwork: 'google',
      fallbackEnabled: true,
      refreshInterval: 300000, // 5 minutes
      networks: {
        google: {
          enabled: true,
          priority: 1,
          interstitialId: __DEV__ ? 'ca-app-pub-3940256099942544/1033173712' : 'YOUR_GOOGLE_INTERSTITIAL_ID',
          rewardedId: __DEV__ ? 'ca-app-pub-3940256099942544/5224354917' : 'YOUR_GOOGLE_REWARDED_ID',
          bannerIds: {
            small: __DEV__ ? 'ca-app-pub-3940256099942544/6300978111' : 'YOUR_GOOGLE_BANNER_ID',
            large: __DEV__ ? 'ca-app-pub-3940256099942544/6300978111' : 'YOUR_GOOGLE_LARGE_BANNER_ID',
          },
        },
        facebook: {
          enabled: false,
          priority: 2,
          interstitialId: 'YOUR_FB_INTERSTITIAL_ID',
          rewardedId: 'YOUR_FB_REWARDED_ID',
          bannerIds: {
            small: 'YOUR_FB_BANNER_ID',
            large: 'YOUR_FB_LARGE_BANNER_ID',
          },
        },
        applovin: {
          enabled: false,
          priority: 3,
          sdkKey: 'YOUR_APPLOVIN_SDK_KEY',
          interstitialId: 'YOUR_APPLOVIN_INTERSTITIAL_ID',
          rewardedId: 'YOUR_APPLOVIN_REWARDED_ID',
          bannerIds: {
            small: 'YOUR_APPLOVIN_BANNER_ID',
            large: 'YOUR_APPLOVIN_LARGE_BANNER_ID',
          },
        },
      },
      adFrequency: {
        interstitial: {
          minInterval: 60000, // 1 minute between interstitials
          maxPerSession: 5,
        },
        rewarded: {
          minInterval: 30000, // 30 seconds between rewarded ads
          maxPerSession: 10,
        },
      },
    };
  }

  // Get network priority order
  getNetworkPriorityOrder() {
    if (!this.cachedConfig) {
      return ['google', 'facebook', 'applovin'];
    }

    const networks = Object.entries(this.cachedConfig.networks || {})
      .filter(([_, config]) => config.enabled)
      .sort(([_, a], [__, b]) => (a.priority || 999) - (b.priority || 999))
      .map(([network, _]) => network);

    return networks.length > 0 ? networks : ['google'];
  }

  // Get specific network config
  getNetworkConfig(network) {
    if (!this.cachedConfig) {
      const defaultConfig = this.getDefaultConfig();
      return defaultConfig.networks[network];
    }

    return this.cachedConfig.networks?.[network] || null;
  }

  // Check if network is enabled
  isNetworkEnabled(network) {
    const config = this.getNetworkConfig(network);
    return config?.enabled || false;
  }

  // Get active network from config
  getActiveNetwork() {
    if (!this.cachedConfig) {
      return 'google';
    }

    return this.cachedConfig.activeNetwork || 'google';
  }

  // Force refresh config
  async refreshConfig() {
    this.cachedConfig = null;
    this.lastFetchTime = null;
    return await this.fetchAdConfig();
  }

  // Clear cached config
  async clearCache() {
    this.cachedConfig = null;
    this.lastFetchTime = null;
    await AsyncStorage.removeItem('adConfig');
  }
}

// Singleton instance
const adConfigService = new AdConfigService();

export default adConfigService;
