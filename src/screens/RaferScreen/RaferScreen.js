import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Clipboard,
  Alert,
  Share,
} from 'react-native';
import {Colors} from '../../constants/colors';
import {horizontalScale, verticalScale} from '../../constants/helper';
import {Images} from '../../assets/images';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RaferScreen() {
  const [userData, setUserData] = useState({
    refer_code: 'TH175620698967',
    username: 'User123',
  });
  const [totalInvites, setTotalInvites] = useState(0);
  const [masterCoin, setMasterCoin] = useState(0);
  const [invitedUsers, setInvitedUsers] = useState([
    {id: 1, name: 'Alice Johnson', joinDate: '2024-01-15', earned: 100},
    {id: 2, name: 'Bob Smith', joinDate: '2024-01-18', earned: 100},
    {id: 3, name: 'Charlie Brown', joinDate: '2024-01-20', earned: 100},
  ]);

  useEffect(() => {
    loadUserData();
    setTotalInvites(invitedUsers.length);
  }, []);

  const loadUserData = async () => {
    try {
      const totalMasterCoin = await AsyncStorage.getItem('masterCoin');
      const userDataString = await AsyncStorage.getItem('userData');

      if (totalMasterCoin) {
        setMasterCoin(parseFloat(totalMasterCoin) || 0);
      }

      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const copyReferralCode = async () => {
    try {
      await Clipboard.setString(userData.refer_code);
      Alert.alert('Copied!', 'Referral code copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy referral code');
    }
  };

  const shareReferralCode = async () => {
    try {
      const result = await Share.share({
        message: `Join MTC Mining with my referral code: ${userData.refer_code} and start earning crypto today!`,
        title: 'Join MTC Mining',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code');
    }
  };

  const renderInvitedUser = ({item}) => (
    <View style={styles.userItem}>
      <View style={styles.userAvatar}>
        <Text style={styles.userInitial}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userJoinDate}>Joined {item.joinDate}</Text>
      </View>
      <View style={styles.userEarnings}>
        <Text style={styles.earningsAmount}>+{item.earned}</Text>
        <Text style={styles.earningsLabel}>coins</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Referral Program" ishelp={true} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image style={styles.headerImage} source={Images.handShakeIcon} />
          <Text style={styles.headerTitle}>Invite Friends & Earn!</Text>
          <Text style={styles.headerDescription}>
            Invite friends to join MTC Mining and earn rewards together. The
            more friends you invite, the more you earn!
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalInvites}</Text>
            <Text style={styles.statLabel}>Total Invites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{masterCoin}</Text>
            <Text style={styles.statLabel}>Coins Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100</Text>
            <Text style={styles.statLabel}>Per Referral</Text>
          </View>
        </View>

        {/* Referral Code Section */}
        <View style={styles.referralSection}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.referralCodeContainer}>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{userData.refer_code}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyReferralCode}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareReferralCode}>
            <Image source={Images.rePostIcon} style={styles.shareIcon} />
            <Text style={styles.shareButtonText}>Share Referral Link</Text>
          </TouchableOpacity>
        </View>

        {/* How it Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>
                  Send your referral code to friends
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friends Join</Text>
                <Text style={styles.stepDescription}>
                  They sign up using your code
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Earn Rewards</Text>
                <Text style={styles.stepDescription}>
                  Get 100 super coins per referral
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Invited Users Section */}
        {invitedUsers.length > 0 && (
          <View style={styles.invitedUsersSection}>
            <Text style={styles.sectionTitle}>
              Your Invites ({totalInvites})
            </Text>
            <View style={styles.usersContainer}>
              <FlatList
                data={invitedUsers}
                renderItem={renderInvitedUser}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}

        {/* Terms Section */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Referral rewards are credited after your friend completes
            registration
            {'\n'}• Maximum 50 referrals per user
            {'\n'}• Rewards may take up to 24 hours to process
            {'\n'}• Fake accounts or abuse will result in account suspension
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.semiGray,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  headerSection: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  headerImage: {
    height: verticalScale(80),
    width: verticalScale(80),
    resizeMode: 'contain',
    marginBottom: verticalScale(15),
  },
  headerTitle: {
    fontSize: verticalScale(24),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: verticalScale(10),
  },
  headerDescription: {
    fontSize: verticalScale(14),
    color: Colors.grey_500,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: horizontalScale(10),
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: verticalScale(30),
    gap: horizontalScale(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: verticalScale(15),
    padding: verticalScale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: verticalScale(24),
    fontWeight: 'bold',
    color: Colors.secondaryColor,
    marginBottom: verticalScale(5),
  },
  statLabel: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
    textAlign: 'center',
  },
  referralSection: {
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: verticalScale(15),
  },
  referralCodeContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(15),
    gap: horizontalScale(10),
  },
  codeDisplay: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: verticalScale(12),
    padding: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.secondaryColor,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: verticalScale(16),
    fontWeight: 'bold',
    color: Colors.secondaryColor,
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: Colors.secondaryColor,
    borderRadius: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyButtonText: {
    color: Colors.white,
    fontSize: verticalScale(14),
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: Colors.primaryColor,
    borderRadius: verticalScale(12),
    padding: verticalScale(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(10),
  },
  shareIcon: {
    width: verticalScale(20),
    height: verticalScale(20),
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: verticalScale(16),
    fontWeight: '600',
  },
  howItWorksSection: {
    marginBottom: verticalScale(30),
  },
  stepContainer: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(15),
    padding: verticalScale(20),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  stepNumber: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: Colors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(15),
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: verticalScale(16),
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(3),
  },
  stepDescription: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
  },
  invitedUsersSection: {
    marginBottom: verticalScale(30),
  },
  usersContainer: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(15),
    padding: verticalScale(15),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightLine,
  },
  userAvatar: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderRadius: verticalScale(22.5),
    backgroundColor: Colors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(15),
  },
  userInitial: {
    color: Colors.white,
    fontSize: verticalScale(18),
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(2),
  },
  userJoinDate: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
  },
  userEarnings: {
    alignItems: 'flex-end',
  },
  earningsAmount: {
    fontSize: verticalScale(16),
    fontWeight: 'bold',
    color: Colors.secondaryColor,
  },
  earningsLabel: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
  },
  termsSection: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(15),
    padding: verticalScale(20),
    marginBottom: verticalScale(150),
  },
  termsTitle: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: verticalScale(10),
  },
  termsText: {
    fontSize: verticalScale(12),
    color: Colors.grey_500,
    lineHeight: 18,
  },
});
