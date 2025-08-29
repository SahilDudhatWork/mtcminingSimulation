import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Colors} from '../constants/colors';
import {horizontalScale, verticalScale} from '../constants/helper';
import {Images} from '../assets/images';
import adManager from '../utils/adManager';
import {showToast} from '../utils/toastUtils';

const TimeBoostModal = ({visible, onClose, onWatchAd, onSpendCoins}) => {
  const screenHeight = Dimensions.get('window').height;

  const handleWatchAd = async () => {
    try {
      const result = await adManager.showRewardedAd();
      if (result.success) {
        showToast.success(
          'Reward Earned!',
          '+30 minutes added to your mining time',
        );
        onWatchAd();
      } else {
        showToast.info('Ad Cancelled', 'Watch the complete ad to earn rewards');
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      showToast.error('Ad Error', 'Unable to load ad. Please try again.');
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Image source={Images.Hourglass} style={styles.hourglassIcon} />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image source={Images.closeIcon} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>Increase Time</Text>
          <Text style={styles.subtitle}>
            Boost your mining time to earn more rewards!
          </Text>
          <ScrollView>
            {/* Time Options */}
            <View style={styles.optionsContainer}>
              <Text style={styles.optionsTitle}>Choose time boost:</Text>

              {/* 30 Minutes - Watch Ad */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={handleWatchAd}>
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIcon,
                      {backgroundColor: Colors.secondaryColor + '20'},
                    ]}>
                    <Image
                      source={Images.presentIcon}
                      style={[
                        styles.optionIconImage,
                        {tintColor: Colors.secondaryColor},
                      ]}
                    />
                  </View>
                  <View>
                    <Text style={styles.optionTitle}>+30 Minutes</Text>
                    <Text style={styles.optionDesc}>Watch a short ad</Text>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <Text style={styles.freeText}>FREE</Text>
                </View>
              </TouchableOpacity>

              {/* 1 Hour - 50 Coins */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => onSpendCoins(50, 60)}>
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIcon,
                      {backgroundColor: Colors.primaryColor + '20'},
                    ]}>
                    <Image
                      source={Images.Hourglass}
                      style={[
                        styles.optionIconImage,
                        {tintColor: Colors.primaryColor},
                      ]}
                    />
                  </View>
                  <View>
                    <Text style={styles.optionTitle}>+1 Hour</Text>
                    <Text style={styles.optionDesc}>Extend mining time</Text>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <View style={styles.coinContainer}>
                    <Image source={Images.starIcon} style={styles.coinIcon} />
                    <Text style={styles.coinText}>50</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 2 Hours - 90 Coins */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => onSpendCoins(90, 120)}>
                <View style={styles.optionLeft}>
                  <View
                    style={[styles.optionIcon, {backgroundColor: '#FF6B6B20'}]}>
                    <Image
                      source={Images.Roaket}
                      style={[styles.optionIconImage, {tintColor: '#FF6B6B'}]}
                    />
                  </View>
                  <View>
                    <Text style={styles.optionTitle}>+2 Hours</Text>
                    <Text style={styles.optionDesc}>Maximum boost</Text>
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <View style={styles.coinContainer}>
                    <Image source={Images.starIcon} style={styles.coinIcon} />
                    <Text style={styles.coinText}>90</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Benefits Section */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              <View style={styles.benefitItem}>
                <Image source={Images.Tick} style={styles.benefitIcon} />
                <Text style={styles.benefitText}>
                  Increase total mining time
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Image source={Images.Tick} style={styles.benefitIcon} />
                <Text style={styles.benefitText}>Earn more USDT rewards</Text>
              </View>
              <View style={styles.benefitItem}>
                <Image source={Images.Tick} style={styles.benefitIcon} />
                <Text style={styles.benefitText}>Stack with speed boosts</Text>
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
  iconContainer: {
    width: verticalScale(60),
    height: verticalScale(60),
    borderRadius: verticalScale(30),
    backgroundColor: Colors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourglassIcon: {
    width: verticalScale(30),
    height: verticalScale(30),
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
  closeButton: {
    width: verticalScale(35),
    height: verticalScale(35),
    borderRadius: verticalScale(17.5),
    backgroundColor: Colors.grey_300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: verticalScale(18),
    height: verticalScale(18),
    tintColor: Colors.grey_500,
    resizeMode: 'contain',
  },
  title: {
    fontSize: verticalScale(24),
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: verticalScale(14),
    color: Colors.grey_500,
    textAlign: 'center',
    marginBottom: verticalScale(25),
    lineHeight: verticalScale(20),
  },
  optionsContainer: {
    marginBottom: verticalScale(25),
  },
  optionsTitle: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(15),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgColor,
    borderRadius: verticalScale(15),
    padding: verticalScale(15),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: Colors.grey_300,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderRadius: verticalScale(22.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(12),
  },
  optionIconImage: {
    width: verticalScale(22),
    height: verticalScale(22),
    resizeMode: 'contain',
  },
  optionTitle: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(2),
  },
  optionDesc: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
  },
  popularBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: verticalScale(10),
    marginTop: verticalScale(4),
    alignSelf: 'flex-start',
  },
  popularText: {
    fontSize: verticalScale(10),
    fontWeight: 'bold',
    color: Colors.white,
  },
  optionRight: {
    alignItems: 'flex-end',
  },
  freeText: {
    fontSize: verticalScale(14),
    fontWeight: 'bold',
    color: Colors.secondaryColor,
    backgroundColor: Colors.secondaryColor + '20',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(15),
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor + '20',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(15),
  },
  coinIcon: {
    width: verticalScale(16),
    height: verticalScale(16),
    marginRight: horizontalScale(4),
    resizeMode: 'contain',
  },
  coinText: {
    fontSize: verticalScale(14),
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  benefitsContainer: {
    backgroundColor: Colors.lightGrey,
    borderRadius: verticalScale(15),
    padding: verticalScale(15),
  },
  benefitsTitle: {
    fontSize: verticalScale(14),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(10),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  benefitIcon: {
    width: verticalScale(16),
    height: verticalScale(16),
    tintColor: Colors.secondaryColor,
    marginRight: horizontalScale(8),
    resizeMode: 'contain',
  },
  benefitText: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
    flex: 1,
  },
});

export default TimeBoostModal;
