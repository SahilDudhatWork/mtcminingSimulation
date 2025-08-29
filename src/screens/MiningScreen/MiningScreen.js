import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Share,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from './styles';
import Carousel from 'react-native-snap-carousel';
import {Colors} from '../../constants/colors';
import {Images} from '../../assets/images';
import {horizontalScale, verticalScale} from '../../constants/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../components/Popup';
import MysteryBoxModal from '../../components/MysteryBoxModal';
import BoostGhsModal from '../../components/BoostGhsModal';
import TimeBoostModal from '../../components/TimeBoostModal';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';
import CustomStatusBar from '../../components/CustomStatusBar';
import {showToast} from '../../utils/toastUtils';

const MiningScreen = props => {
  const navigation = useNavigation();
  const [currentOption, setCurrentOption] = useState(0);
  const {user, apiResponse} = useAuth();
  const [userData, setUserData] = useState({}); // State to store user name
  const [isMining, setIsMining] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const EARNINGS_PER_SECOND = 1 / (3 * 60); // Total earnings divided by the number of seconds in 3 minutes
  const MINING_DURATION_MS = 3 * 60 * 1000; // 3 minutes in milliseconds

  // for gift
  const [isVisible, setIsVisible] = useState(false);
  const [isGiftMining, setIsGiftMining] = useState(false);
  const [giftTimeRemaining, setGiftTimeRemaining] = useState(0);
  const [giftIntervalId, setGiftIntervalId] = useState(null);
  const [giftAmt, setGiftAmt] = useState(0);
  const [masterCoin, setMasterCoin] = useState(0);

  // for boost modals
  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState(false);
  const [showBoostGhsModal, setShowBoostGhsModal] = useState(false);
  const [showTimeBoostModal, setShowTimeBoostModal] = useState(false);
  const [currentGhs, setCurrentGhs] = useState(30);
  const [maxGhs] = useState(100);
  const GIFT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const MAX_TIME_BOOST_MS = 2 * 60 * 60 * 1000; // 2 hours cap for time boost

  useEffect(() => {
    // Load user data from auth context
    if (user && apiResponse) {
      setUserData({
        username: user.name || 'Guest User',
        refer_code: user.refer_code || 'N/A',
        email: user.email || 'N/A',
        id: user.id || 'N/A',
        isActive: user.is_active || 0,
        isVerified: user.is_verified || 0,
        socialType: user.social_type || 'email',
        createdAt: user.created_at || 'N/A',
        mine: user.mine || 0,
      });
    }
  }, [user, apiResponse]);

  const OptionIcon = [
    {
      id: 0,
      title: 'Increase Time',
      disc: 'You can increase the mining time up to',
      subDisc: '2 Hours',
      image: Images.Hourglass,
      color: Colors.secondaryColor,
    },
    {
      id: 1,
      title: 'Boost Gh/s',
      disc: 'You can boost the mining Gh/s up to',
      subDisc: '100 Gh/s',
      image: Images.Roaket,
      color: Colors.secondaryColor,
    },
  ];

  useEffect(() => {
    const focusListener = navigation.addListener('focus', async () => {
      const totalMasterCoin = await AsyncStorage.getItem('masterCoin');
      if (totalMasterCoin) {
        setMasterCoin(parseFloat(totalMasterCoin) || 0);
      }
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const userDataString = await AsyncStorage.getItem('userData');
    //     if (userDataString) {
    //       let data = JSON.parse(userDataString);
    //       setUserData(data);
    //     }
    //   } catch (error) {
    //     console.error('Error retrieving user data:', error);
    //   }
    // };
    const loadMiningData = async () => {
      try {
        const sessionStart = await AsyncStorage.getItem('sessionStart');
        const totalEarnedValue = await AsyncStorage.getItem('totalEarned');

        if (sessionStart) {
          const startTime = new Date(parseInt(sessionStart, 10));
          const currentTime = new Date();
          const elapsedTime = currentTime - startTime;

          if (elapsedTime >= MINING_DURATION_MS) {
            await AsyncStorage.removeItem('sessionStart');
            setIsMining(false);
            setTimeRemaining(0);
          } else {
            setTotalEarned(parseFloat(totalEarnedValue) || 0);
            setIsMining(true);
            setTimeRemaining(MINING_DURATION_MS - elapsedTime);
          }
        } else {
          setTotalEarned(parseFloat(totalEarnedValue) || 0);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // fetchData();
    loadMiningData();
  }, []);

  useEffect(() => {
    if (isMining && timeRemaining > 0) {
      const miningIntervalId = setInterval(async () => {
        setTotalEarned(prev => {
          const newTotalEarned = prev + EARNINGS_PER_SECOND;
          return newTotalEarned;
        });

        setTimeRemaining(prev => {
          const newTimeRemaining = prev - 1000;
          if (newTimeRemaining <= 0) {
            const roundedTotalEarned = Math.round(totalEarned);
            AsyncStorage.setItem('totalEarned', roundedTotalEarned.toString()); // Store updated earnings
            AsyncStorage.removeItem('sessionStart');
            setIsMining(false);
            setTimeRemaining(0);
            clearInterval(miningIntervalId);
          }
          return newTimeRemaining;
        });
      }, 1000); // Update earnings every second

      setIntervalId(miningIntervalId);
    }

    return () => clearInterval(intervalId);
  }, [isMining, timeRemaining]);
  // Load previous state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedEarnings = await AsyncStorage.getItem('totalEarned');
        const storedStartTime = await AsyncStorage.getItem('sessionStart');

        if (storedEarnings) {
          setTotalEarned(parseFloat(storedEarnings));
        }
        if (storedStartTime) {
          const sessionStart = new Date(parseInt(storedStartTime));
          const now = new Date();
          const elapsedTime = now - sessionStart;

          if (elapsedTime < MINING_DURATION_MS) {
            let currentTotalEarned = parseFloat(storedEarnings) || 0;

            const earnedFromPreviousSession =
              (elapsedTime / 1000) * EARNINGS_PER_SECOND;

            // Update total earnings with the previous session earnings
            currentTotalEarned += earnedFromPreviousSession;

            setTotalEarned(parseFloat(currentTotalEarned));

            setStartTime(sessionStart);
            setIsMining(true);
            setTimeRemaining(MINING_DURATION_MS - elapsedTime);
          } else {
            // If mining session has expired
            const earnedFromSession =
              EARNINGS_PER_SECOND * (MINING_DURATION_MS / 1000);

            setTotalEarned(prev => prev + earnedFromSession);
            await AsyncStorage.setItem(
              'totalEarned',
              (parseFloat(storedEarnings) + earnedFromSession).toString(),
            );
            await AsyncStorage.removeItem('sessionStart');
            setIsMining(false);
            setTimeRemaining(0);
          }
        } else {
          setIsMining(false);
        }
      } catch (error) {
        console.error('Failed to load state from AsyncStorage:', error);
      }
    };

    loadState();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    const loadGift = async () => {
      try {
        const giftStoredSession = await AsyncStorage.getItem(
          'mysteryBoxCooldownStart',
        );
        if (giftStoredSession) {
          const sessionStart = new Date(parseInt(giftStoredSession));
          const now = new Date();
          const elapsedTime = now - sessionStart;

          if (elapsedTime < GIFT_DURATION_MS) {
            setIsGiftMining(true);
            setGiftTimeRemaining(GIFT_DURATION_MS - elapsedTime);
          } else {
            await AsyncStorage.removeItem('mysteryBoxCooldownStart');
            setIsGiftMining(false);
            setGiftTimeRemaining(0);
          }
        } else {
          setIsGiftMining(false);
        }
      } catch (error) {
        console.error('Failed to load state from AsyncStorage:', error);
      }
    };

    loadGift();

    return () => {
      if (giftIntervalId) {
        clearInterval(giftIntervalId);
      }
    };
  }, []);

  const startMining = async () => {
    try {
      if (!isMining) {
        // Get the current time
        const now = new Date().getTime();
        // Start a new mining session
        await AsyncStorage.setItem('sessionStart', now.toString());
        setIsMining(true);
        // Reset the timer for the new session
        setTimeRemaining(MINING_DURATION_MS);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = ms => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    if (isGiftMining && giftTimeRemaining > 0) {
      const giftMiningIntervalId = setInterval(async () => {
        setGiftTimeRemaining(prev => {
          const newTimeRemaining = prev - 1000;
          if (newTimeRemaining <= 0) {
            AsyncStorage.removeItem('mysteryBoxCooldownStart');
            setIsGiftMining(false);
            setGiftTimeRemaining(0);
            clearInterval(giftMiningIntervalId);
          }
          return newTimeRemaining;
        });
      }, 1000); // Update earnings every second

      setGiftIntervalId(giftMiningIntervalId);
    }

    return () => clearInterval(giftIntervalId);
  }, [isGiftMining, giftTimeRemaining]);

  const openGift = async () => {
    if (!isGiftMining) {
      const randomAmount = await getRandomInt(10, 200);
      setGiftAmt(randomAmount);
      setShowMysteryBoxModal(true);
    }
  };

  const getRandomInt = async (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const claimReward = async () => {
    setShowMysteryBoxModal(false);
    setMasterCoin(prev => {
      const totalMasterCoin = prev + giftAmt;
      AsyncStorage.setItem('masterCoin', totalMasterCoin.toString());
      return totalMasterCoin;
    });
    const now = new Date().getTime();
    await AsyncStorage.setItem('mysteryBoxCooldownStart', now.toString());
    setIsGiftMining(true);
    setGiftTimeRemaining(GIFT_DURATION_MS);
  };

  const handleWatchAd = () => {
    // Implement ad watching logic here
    console.log('Watch ad clicked');
    // After watching ad, could give bonus rewards
    claimReward();
  };

  const handleTimeBoost = () => {
    setShowTimeBoostModal(true);
  };

  const handleWatchAdForTime = () => {
    // Add 30 minutes to mining time
    console.log('Watch ad for 30 minutes time boost');
    setShowTimeBoostModal(false);
    // Implement ad watching logic here
    addMiningTime(30 * 60 * 1000); // 30 minutes in milliseconds
  };

  const handleSpendCoinsForTime = (coins, minutes) => {
    // Check if user has enough coins
    if (masterCoin >= coins) {
      console.log(`Spend ${coins} coins for ${minutes} minutes boost`);
      setMasterCoin(prev => {
        const newAmount = prev - coins;
        AsyncStorage.setItem('masterCoin', newAmount.toString());
        return newAmount;
      });
      addMiningTime(minutes * 60 * 1000); // Convert minutes to milliseconds
      setShowTimeBoostModal(false);
    } else {
      console.log('Not enough coins');
      // Could show an alert or toast message
    }
  };

  const addMiningTime = additionalTime => {
    if (isMining) {
      setTimeRemaining(prev =>
        Math.min(prev + additionalTime, MAX_TIME_BOOST_MS),
      );
    } else {
      const newTime = Math.min(additionalTime, MAX_TIME_BOOST_MS);
      setTimeRemaining(newTime);
      setIsMining(true);
      const now = new Date().getTime();
      AsyncStorage.setItem('sessionStart', now.toString());
    }
  };

  const handleGhsBoost = () => {
    setShowBoostGhsModal(true);
  };

  const handleBoostConfirm = () => {
    if (currentGhs < maxGhs) {
      setCurrentGhs(prev => Math.min(prev + 10, maxGhs));
      setShowBoostGhsModal(false);
      // Could implement boost logic here
      console.log('Boost applied');
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
  return (
    <View style={styles.mainBox}>
      <CustomStatusBar dark backgroundColor={Colors.semiGray} />
      <SafeAreaView style={styles.mainBox}>
        <ScrollView style={styles.mainBox}>
          <View style={styles.mainBox}>
            <View
              style={{
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontWeight: '500',
                    fontSize: 16,
                  }}>
                  Hello, {userData.username}
                </Text>
                <Text
                  style={{
                    color: Colors.secondaryColor,
                    fontSize: 10,
                    letterSpacing: 2,
                    fontWeight: '500',
                  }}>
                  #{userData?.refer_code}
                </Text>
              </View>
              <Pressable
                onPress={() => props.navigation.navigate('HelpScreen')}
                style={{
                  overflow: 'hidden',
                  backgroundColor: Colors.white,
                  height: verticalScale(30),
                  width: verticalScale(30),
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 6,
                  marginHorizontal: 10,
                }}>
                <Image
                  style={{flex: 1, resizeMode: 'center'}}
                  source={Images.Question}
                />
              </Pressable>
              <Pressable
                onPress={() => props.navigation.navigate('ProfileScreen')}
                style={{
                  overflow: 'hidden',
                  backgroundColor: Colors.white,
                  height: verticalScale(40),
                  width: verticalScale(40),
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 6,
                }}>
                <Image
                  style={{flex: 1, resizeMode: 'center'}}
                  source={Images.happinessIcon}
                />
              </Pressable>
            </View>
            <View style={{padding: 20}}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 20,
                  borderRadius: 15,
                  flexDirection: 'row',
                }}>
                <ImageBackground
                  source={Images.Sixangle}
                  tintColor={Colors.secondaryColor}
                  style={{
                    height: 60,
                    width: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  resizeMode="contain">
                  <Image
                    style={{resizeMode: 'contain', height: 25, width: 25}}
                    resizeMode="center"
                    source={Images.TLogo}
                  />
                </ImageBackground>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: Colors.black,
                      letterSpacing: 2,
                      fontSize: 10,
                      fontWeight: '500',
                    }}>
                    CURRENT BANALCE
                  </Text>
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 19,
                      fontWeight: '600',
                    }}>
                    {totalEarned.toFixed(4)} USDT
                  </Text>
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 12,
                      fontWeight: '500',
                    }}>
                    0.0056/min
                  </Text>
                </View>
                <Image source={Images.Info} style={{height: 15, width: 15}} />
              </View>
              <View style={{flexDirection: 'row', gap: 15}}>
                <View
                  style={{
                    backgroundColor: Colors.secondaryColor,
                    padding: 20,
                    borderRadius: 15,
                    flexDirection: 'row',
                    marginTop: 15,
                    flex: 0.65,
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.white,
                        letterSpacing: 2,
                        fontSize: 10,
                        fontWeight: '500',
                      }}>
                      SUPER COINS
                    </Text>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: '600',
                        marginVertical: 5,
                      }}>
                      {masterCoin}
                    </Text>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: '500',
                      }}>
                      ~ 0.17 USDT
                    </Text>
                  </View>
                  <Image
                    source={Images.Info}
                    style={{height: 15, width: 15, tintColor: Colors.white}}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(42, 63, 189, 0.35)',
                    padding: 20,
                    borderRadius: 15,
                    flexDirection: 'row',
                    marginTop: 15,
                    flex: 0.35,
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.white,
                        letterSpacing: 2,
                        fontSize: 10,
                        fontWeight: '500',
                      }}>
                      LAVEL
                    </Text>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: '600',
                        marginVertical: 5,
                      }}>
                      1 <Text style={{fontSize: 12}}>/10 Lavels</Text>
                    </Text>
                    <Text style={{color: Colors.main}}>-</Text>
                  </View>
                  <Image
                    source={Images.Info}
                    style={{height: 15, width: 15, tintColor: Colors.white}}
                  />
                </View>
              </View>

              <Pressable
                onPress={() => {
                  shareReferralCode();
                }}
                style={{
                  marginTop: verticalScale(20),
                  borderRadius: verticalScale(10),
                  flexDirection: 'row',
                  width: '100%',
                  backgroundColor: Colors.primaryColor,
                  height: verticalScale(70),
                  alignItems: 'center',
                  paddingHorizontal: horizontalScale(15),
                }}>
                <View
                  style={{
                    borderRadius: verticalScale(10),
                    height: verticalScale(40),
                    width: verticalScale(40),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.secondaryColor,
                  }}>
                  <Image
                    style={{
                      height: verticalScale(20),
                      width: verticalScale(20),
                      resizeMode: 'contain',
                      tintColor: Colors.white,
                    }}
                    source={Images.multipleUsersIcon}
                  />
                </View>
                <View style={{marginLeft: horizontalScale(10)}}>
                  <Text style={{color: Colors.white}}>Invite Friends</Text>
                  <Text
                    style={{color: Colors.white, fontSize: verticalScale(11)}}>
                    Earn extra by inviting your friends
                  </Text>
                </View>
              </Pressable>
            </View>
            <View
              style={{
                backgroundColor: Colors.white,
                paddingHorizontal: 20,
                paddingVertical: 40,
                borderRadius: 30,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={handleTimeBoost}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    backgroundColor: Colors.secondaryColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={Images.Hourglass}
                    style={{
                      resizeMode: 'center',
                      height: 25,
                      width: 25,
                      tintColor: Colors.white,
                    }}
                  />
                  {timeRemaining < MAX_TIME_BOOST_MS && (
                    <Image
                      source={Images.RedDot}
                      style={{
                        resizeMode: 'center',
                        height: 18,
                        width: 18,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                      }}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleGhsBoost}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    backgroundColor: Colors.secondaryColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={Images.Roaket}
                    style={{
                      resizeMode: 'center',
                      height: 25,
                      width: 25,
                      tintColor: Colors.white,
                    }}
                  />
                  {currentGhs < maxGhs && (
                    <Image
                      source={Images.RedDot}
                      style={{
                        resizeMode: 'center',
                        height: 18,
                        width: 18,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(42, 63, 189, 0.1)',
                  width: Dimensions.get('window').width * 0.7,
                  height: Dimensions.get('window').width * 0.7,
                  borderRadius: Dimensions.get('window').width * 0.35,
                  alignSelf: 'center',
                  padding: 15,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -15,
                  marginBottom: 30,
                }}>
                <View
                  style={{
                    backgroundColor: 'rgba(42, 63, 189, 0.35)',
                    borderRadius: Dimensions.get('window').width * 0.35,
                    alignSelf: 'center',
                    flex: 1,
                    width: '100%',
                    padding: 15,
                  }}>
                  <Pressable
                    onPress={startMining}
                    style={{
                      backgroundColor: Colors.secondaryColor,
                      borderRadius: Dimensions.get('window').width * 0.35,
                      alignSelf: 'center',
                      flex: 1,
                      width: '100%',
                      borderWidth: 3,
                      borderColor: Colors.secondaryColor,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: '500',
                        textAlign: 'center',
                        letterSpacing: 2,
                      }}>
                      {!isMining && 'CLICK HERE TO'}
                    </Text>
                    {isMining ? (
                      <Text
                        style={{
                          color: false ? Colors.darkGreen : Colors.white,
                          fontSize: 24,
                          fontWeight: '500',
                          marginVertical: 5,
                          textAlign: 'center',
                          letterSpacing: 0,
                        }}>
                        {formatTime(timeRemaining)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: '500',
                          marginVertical: 5,
                          textAlign: 'center',
                          letterSpacing: 0,
                        }}>
                        Start Mining
                      </Text>
                    )}
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: '500',
                        textAlign: 'center',
                        letterSpacing: 2,
                      }}>
                      {isMining && `${currentGhs} GH/S`}
                    </Text>
                  </Pressable>
                </View>
              </View>
              <Carousel
                data={OptionIcon}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        item.id === 0 ? handleTimeBoost() : handleGhsBoost()
                      }
                      style={{
                        backgroundColor: Colors.bgColor,
                        padding: 20,
                        borderRadius: 15,
                        flexDirection: 'row',
                      }}>
                      <ImageBackground
                        source={Images.Sixangle}
                        style={{
                          height: 60,
                          width: 60,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        tintColor={item.color}
                        resizeMode="contain">
                        <Image
                          style={{
                            resizeMode: 'contain',
                            height: 25,
                            width: 25,
                            tintColor: Colors.white,
                          }}
                          resizeMode="center"
                          source={item.image}
                        />
                      </ImageBackground>
                      <View style={{marginLeft: 10, flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flex: 1,
                          }}>
                          <Text
                            style={{
                              color: Colors.black,
                              fontSize: 14,
                              fontWeight: '500',
                            }}>
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              color: Colors.black,
                              fontSize: 10,
                              fontWeight: '500',
                              letterSpacing: 2,
                              padding: 2,
                              backgroundColor: '#c4cfdd',
                              borderRadius: 10,
                              paddingHorizontal: 7,
                            }}>
                            TIP
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: Colors.gray,
                            fontSize: 12,
                            fontWeight: '500',
                            textAlign: 'left',
                            maxWidth: '90%',
                            lineHeight: 20,
                            marginVertical: 5,
                          }}>
                          {item.disc}{' '}
                          <Text style={{fontWeight: '600', color: '#778497'}}>
                            {item.subDisc}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            color: Colors.main,
                            fontSize: 12,
                            fontWeight: '500',
                            color: Colors.secondaryColor,
                          }}>
                          Read more
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                activeSlideAlignment="start"
                sliderWidth={Dimensions.get('window').width - 20}
                itemWidth={Dimensions.get('window').width - 110}
                onSnapToItem={setCurrentOption}
              />
              <FlatList
                data={OptionIcon}
                style={{marginTop: 10, alignSelf: 'center'}}
                horizontal
                renderItem={({item, index}) => (
                  <View
                    style={{
                      padding: 3,
                      backgroundColor:
                        index == currentOption
                          ? Colors.secondaryColor
                          : '#c4cfdd',
                      margin: 3,
                      width: index == currentOption ? 30 : 4,
                      borderRadius: 5,
                    }}></View>
                )}
              />
            </View>
          </View>
        </ScrollView>
        {!isGiftMining && (
          <TouchableOpacity onPress={openGift}>
            <ImageBackground
              source={Images.GiftCircle}
              style={{
                height: verticalScale(70),
                width: verticalScale(70),
                position: 'absolute',
                bottom: verticalScale(50),
                right: 10,
              }}
              resizeMode="center">
              <Image
                source={Images.RedDot}
                style={{
                  resizeMode: 'center',
                  height: verticalScale(18),
                  width: verticalScale(18),
                  position: 'absolute',
                  top: 3,
                  right: 3,
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
        )}
      </SafeAreaView>
      <MysteryBoxModal
        visible={showMysteryBoxModal}
        onClose={() => setShowMysteryBoxModal(false)}
        rewardAmount={giftAmt}
        onWatchAd={handleWatchAd}
        onOpenDirect={claimReward}
      />

      <BoostGhsModal
        visible={showBoostGhsModal}
        onClose={() => setShowBoostGhsModal(false)}
        currentGhs={currentGhs}
        maxGhs={maxGhs}
        hasReachedLimit={currentGhs >= maxGhs}
        onBoost={handleBoostConfirm}
      />

      <TimeBoostModal
        visible={showTimeBoostModal}
        onClose={() => setShowTimeBoostModal(false)}
        onWatchAd={handleWatchAdForTime}
        onSpendCoins={handleSpendCoinsForTime}
      />
    </View>
  );
};

export default MiningScreen;
