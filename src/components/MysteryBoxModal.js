import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {verticalScale, horizontalScale} from '../constants/helper';
import {Colors} from '../constants/colors';

const MysteryBoxModal = ({
  visible,
  onClose,
  rewardAmount = 'XXXXX',
  onWatchAd,
  onOpenDirect,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* 3D Gift Box Image Placeholder */}
          <View style={styles.giftBoxContainer}>
            <View style={styles.giftBox}>
              <View style={[styles.giftBoxTop, {backgroundColor: '#4ECDC4'}]}>
                <View style={styles.ribbon} />
              </View>
              <View style={[styles.giftBoxBottom, {backgroundColor: '#45B7AF'}]} />
              <View style={styles.giftContent}>
                <View style={styles.coin} />
                <View style={[styles.coin, {left: 20, backgroundColor: '#FFD700'}]} />
                <View style={[styles.coin, {left: 40, top: 10, backgroundColor: '#FFA500'}]} />
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Mystery Box</Text>

          {/* Description */}
          <Text style={styles.description}>
            You have received a Mystery box. Please open it and claim your reward.
          </Text>

          {/* Reward Message */}
          <Text style={styles.rewardText}>
            Woow! <Text style={styles.rewardAmount}>{rewardAmount}</Text> Super coins
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Watch AD Button */}
            <TouchableOpacity style={styles.watchAdButton} onPress={onWatchAd}>
              <Text style={styles.watchAdText}>Watch AD</Text>
            </TouchableOpacity>

            {/* Let's Open It Button */}
            <TouchableOpacity style={styles.openButton} onPress={onOpenDirect}>
              <Text style={styles.openButtonText}>Let's Open It</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <Text style={styles.footerNote}>
            * Every day, you will receive a mystery box. So, don't forget to open it.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: {
    fontSize: 20,
    color: Colors.grey_500,
    fontWeight: 'bold',
  },
  giftBoxContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  giftBox: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  giftBoxTop: {
    width: 80,
    height: 35,
    borderRadius: 8,
    position: 'relative',
    zIndex: 2,
  },
  giftBoxBottom: {
    width: 80,
    height: 45,
    borderRadius: 8,
    marginTop: -5,
    zIndex: 1,
  },
  ribbon: {
    position: 'absolute',
    top: -2,
    left: 35,
    width: 10,
    height: 40,
    backgroundColor: '#2ECC71',
    borderRadius: 2,
  },
  giftContent: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 3,
  },
  coin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498DB',
    position: 'absolute',
  },
  title: {
    fontSize: verticalScale(24),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: verticalScale(15),
  },
  description: {
    fontSize: verticalScale(14),
    color: Colors.grey_500,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  rewardText: {
    fontSize: verticalScale(18),
    color: Colors.black,
    marginBottom: verticalScale(25),
    textAlign: 'center',
  },
  rewardAmount: {
    color: Colors.secondaryColor,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: verticalScale(15),
  },
  watchAdButton: {
    backgroundColor: Colors.black,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    borderRadius: verticalScale(25),
    marginBottom: verticalScale(10),
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  watchAdText: {
    color: Colors.white,
    fontSize: verticalScale(12),
    fontWeight: '600',
  },
  openButton: {
    backgroundColor: Colors.secondaryColor,
    paddingVertical: verticalScale(15),
    borderRadius: verticalScale(10),
    width: '100%',
  },
  openButtonText: {
    color: Colors.white,
    fontSize: verticalScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerNote: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
});

export default MysteryBoxModal;
