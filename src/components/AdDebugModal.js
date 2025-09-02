import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {verticalScale, horizontalScale} from '../constants/helper';
import {Colors} from '../constants/colors';
import enhancedAdManager from '../utils/enhancedAdManager';
import adConfigService from '../services/adConfigService';

const AdDebugModal = ({visible, onClose}) => {
  const [adStatus, setAdStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadAdStatus();
    }
  }, [visible]);

  const loadAdStatus = () => {
    const status = enhancedAdManager.getAdStatus();
    setAdStatus(status);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await enhancedAdManager.refreshConfig();
      loadAdStatus();
    } catch (error) {
      console.error('Error refreshing:', error);
    }
    setRefreshing(false);
  };

  const testInterstitial = async () => {
    const result = await enhancedAdManager.showInterstitialAd();
    console.log('Interstitial test result:', result);
    loadAdStatus();
  };

  const testRewarded = async () => {
    const result = await enhancedAdManager.showRewardedAd();
    console.log('Rewarded test result:', result);
    loadAdStatus();
  };

  const switchNetwork = (network) => {
    enhancedAdManager.switchNetwork(network);
    loadAdStatus();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ad Debug Panel</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {/* Current Config */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Configuration</Text>
              <Text style={styles.infoText}>
                Active Network: {adStatus?.config?.activeNetwork || 'Unknown'}
              </Text>
              <Text style={styles.infoText}>
                Networks: {adStatus?.networks?.join(', ') || 'None'}
              </Text>
            </View>

            {/* Ad Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ad Status</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Interstitial Ready:</Text>
                <Text style={[
                  styles.statusValue,
                  {color: adStatus?.ready?.interstitial ? Colors.secondaryColor : Colors.red}
                ]}>
                  {adStatus?.ready?.interstitial ? 'YES' : 'NO'}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Rewarded Ready:</Text>
                <Text style={[
                  styles.statusValue,
                  {color: adStatus?.ready?.rewarded ? Colors.secondaryColor : Colors.red}
                ]}>
                  {adStatus?.ready?.rewarded ? 'YES' : 'NO'}
                </Text>
              </View>
            </View>

            {/* Ad Counts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Stats</Text>
              <Text style={styles.infoText}>
                Interstitials Shown: {adStatus?.counts?.interstitial || 0}
              </Text>
              <Text style={styles.infoText}>
                Rewarded Shown: {adStatus?.counts?.rewarded || 0}
              </Text>
            </View>

            {/* Test Buttons */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Test Ads</Text>
              <TouchableOpacity style={styles.testButton} onPress={testInterstitial}>
                <Text style={styles.testButtonText}>Test Interstitial</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.testButton} onPress={testRewarded}>
                <Text style={styles.testButtonText}>Test Rewarded</Text>
              </TouchableOpacity>
            </View>

            {/* Network Switcher */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Switch Network (Test)</Text>
              <View style={styles.networkButtons}>
                <TouchableOpacity 
                  style={styles.networkButton} 
                  onPress={() => switchNetwork('google')}>
                  <Text style={styles.networkButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.networkButton} 
                  onPress={() => switchNetwork('facebook')}>
                  <Text style={styles.networkButtonText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.networkButton} 
                  onPress={() => switchNetwork('applovin')}>
                  <Text style={styles.networkButtonText}>AppLovin</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: verticalScale(25),
    borderTopRightRadius: verticalScale(25),
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: verticalScale(20),
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    width: verticalScale(35),
    height: verticalScale(35),
    borderRadius: verticalScale(17.5),
    backgroundColor: Colors.grey_300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: Colors.grey_500,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: verticalScale(20),
    backgroundColor: Colors.bgColor,
    borderRadius: verticalScale(12),
    padding: verticalScale(15),
  },
  sectionTitle: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(10),
  },
  infoText: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
    marginBottom: verticalScale(5),
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  statusLabel: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
  },
  statusValue: {
    fontSize: verticalScale(12),
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(8),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  testButtonText: {
    color: Colors.white,
    fontSize: verticalScale(14),
    fontWeight: '600',
  },
  networkButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: horizontalScale(8),
  },
  networkButton: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    paddingVertical: verticalScale(10),
    borderRadius: verticalScale(8),
    alignItems: 'center',
  },
  networkButtonText: {
    color: Colors.white,
    fontSize: verticalScale(12),
    fontWeight: '600',
  },
});

export default AdDebugModal;
