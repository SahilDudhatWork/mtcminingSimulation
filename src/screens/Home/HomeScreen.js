import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../constants/colors';
import {horizontalScale, verticalScale} from '../../constants/helper';
import {Images} from '../../assets/images';
import {useNavigation} from '@react-navigation/native';
import Popup from '../../components/Popup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen(props) {
  const navigation = useNavigation();

  const [list, setList] = useState(
    Array(4)
      .fill()
      .map(() => ({value: 0, opened: false}))
  );
  const [isVisible, setIsVisible] = useState(false);
  const [giftAmt, setGiftAmt] = useState(0);
  const [masterCoin, setMasterCoin] = useState(0);
  const [isGiftMining, setIsGiftMining] = useState(false);
  const [giftTimeRemaining, setGiftTimeRemaining] = useState(0);
  const [giftIntervalId, setGiftIntervalId] = useState(null);
  const [flippedCount, setFlippedCount] = useState(0);
  const MAX_FLIPS = 3;
  const GIFT_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

  useEffect(() => {
    const focusListener = navigation.addListener('focus', async () => {
      const totalMasterCoin = await AsyncStorage.getItem('masterCoin');
      if (totalMasterCoin) {
        setMasterCoin(parseFloat(totalMasterCoin) || 0);
      }
      const getBoxList = await AsyncStorage.getItem('boxList');
      if (getBoxList != null) {
        const list = JSON.parse(getBoxList);
        setList(list);
        setFlippedCount(list.filter(item => item.opened).length);
      } else {
        setList(
          Array(4)
            .fill()
            .map(() => ({value: 0, opened: false}))
        );
        setFlippedCount(0);
      }
      setIsVisible(false);
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    const loadGift = async () => {
      try {
        const giftStoredSession = await AsyncStorage.getItem('giftOpenStart');
        if (giftStoredSession) {
          const sessionStart = new Date(parseInt(giftStoredSession));
          const now = new Date();
          const elapsedTime = now - sessionStart;
          if (elapsedTime < GIFT_DURATION_MS) {
            setIsGiftMining(true);
            setGiftTimeRemaining(GIFT_DURATION_MS - elapsedTime);
          } else {
            await AsyncStorage.removeItem('giftOpenStart');
            await AsyncStorage.removeItem('boxList');
            setIsGiftMining(false);
            setGiftTimeRemaining(0);
            setList(
              Array(4)
                .fill()
                .map(() => ({value: 0, opened: false}))
            );
            setFlippedCount(0);
          }
        } else {
          await AsyncStorage.removeItem('boxList');
          setIsGiftMining(false);
          setGiftTimeRemaining(0);
          setList(
            Array(4)
              .fill()
              .map(() => ({value: 0, opened: false}))
          );
          setFlippedCount(0);
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

  useEffect(() => {
    if (isGiftMining && giftTimeRemaining > 0) {
      const giftMiningIntervalId = setInterval(async () => {
        setGiftTimeRemaining(prev => {
          const newTimeRemaining = prev - 1000;
          if (newTimeRemaining <= 0) {
            AsyncStorage.removeItem('giftOpenStart');
            AsyncStorage.removeItem('boxList');
            setIsGiftMining(false);
            setGiftTimeRemaining(0);
            setList(
              Array(4)
                .fill()
                .map(() => ({value: 0, opened: false}))
            );
            setFlippedCount(0);
            clearInterval(giftMiningIntervalId);
          }
          return newTimeRemaining;
        });
      }, 1000);

      setGiftIntervalId(giftMiningIntervalId);
    }

    return () => clearInterval(giftIntervalId);
  }, [isGiftMining, giftTimeRemaining]);

  const openBox = async index => {
    if (flippedCount >= MAX_FLIPS || list[index].opened) return;

    setIsVisible(true);
    const randomAmount = await getRandomInt(10, 200);
    setGiftAmt(randomAmount);

    let newList = [...list];
    newList[index].value = randomAmount;
    newList[index].opened = true;
    setList(newList);
    setFlippedCount(prev => prev + 1);
    AsyncStorage.setItem('boxList', JSON.stringify(newList));

    if (flippedCount + 1 === 1 && !isGiftMining) {
      const now = new Date().getTime();
      await AsyncStorage.setItem('giftOpenStart', now.toString());
      setIsGiftMining(true);
      setGiftTimeRemaining(GIFT_DURATION_MS);
    }
  };

  const getRandomInt = async (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const claimReward = async () => {
    setIsVisible(false);
    setMasterCoin(prev => {
      const totalMasterCoin = prev + giftAmt;
      AsyncStorage.setItem('masterCoin', totalMasterCoin.toString());
      return totalMasterCoin;
    });
  };

  const renderItem = ({item, index}) => {
    const handlePress = () => openBox(index);
    return (
      <Pressable
        onPress={handlePress}
        style={[
          styles.itemContainer,
          {
            opacity: item.opened ? 0.5 : 1,
            backgroundColor: item.opened ? Colors.grey_400 : Colors.primaryColor,
          },
        ]}
        disabled={item.opened || flippedCount >= MAX_FLIPS}>
        {!item.opened ? (
          <Image style={styles.itemImage} source={Images.giftIcon} />
        ) : (
          <Text style={styles.itemText}>{item.value}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.questionContainer}
        onPress={() => props.navigation.navigate('HelpScreen')}>
        <Image style={styles.queImage} source={Images.Question} />
      </Pressable>
      <View style={styles.innerContainer}>
        <Image style={styles.giftIconContainer} source={Images.presentIcon} />
        <Text style={styles.titleText}>Flip & Win</Text>
        <Text style={styles.descText1}>
          You will win the super coins by playing a simple game
        </Text>
        <View style={styles.pointContainer}>
          <Image style={styles.starImage} source={Images.starIcon} />
          <Text style={styles.pointText}>{masterCoin}</Text>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ConvertCoinScreen')}
          style={styles.flipButton}>
          <Text style={styles.flipButtonText}>Flip a Card</Text>
        </TouchableOpacity>
        <View style={styles.flipCountContainer}>
          <Text style={styles.flipCountText}>{`${flippedCount}/${MAX_FLIPS}`}</Text>
        </View>
        <View style={styles.gridContainer}>
          <FlatList
            data={list}
            renderItem={renderItem}
            numColumns={4}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.grid}
          />
        </View>
        <Text style={styles.descText}>
          * You can flip only 4 cards at a time. Once you flip all the cards you
          have to wait for the next round for 30 minutes.
        </Text>
      </View>
      <Popup
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        btnText={'Claim Your Reward'}
        image={Images.presentIcon}
        text1={'Congrats!'}
        text2={'You win super coins. Best wishes for\nyour next attempt.'}
        text3={`You win ${giftAmt} super coins`}
        onPress={claimReward}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pointContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: horizontalScale(3),
    width: '20%',
    height: verticalScale(30),
    backgroundColor: Colors.borderLine,
    borderRadius: verticalScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointText: {
    marginLeft: horizontalScale(5),
    color: Colors.black,
  },
  starImage: {
    height: verticalScale(22),
    width: verticalScale(22),
    resizeMode: 'contain',
  },
  flipButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: Colors.black,
    borderRadius: verticalScale(10),
    marginTop: verticalScale(20),
  },
  flipButtonText: {
    color: Colors.white,
    fontSize: verticalScale(14),
  },
  flipCountContainer: {
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  flipCountText: {
    color: Colors.grey_500,
    fontSize: verticalScale(14),
  },
  descText1: {
    color: Colors.grey_500,
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  titleText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: verticalScale(20),
    marginTop: verticalScale(15),
  },
  queImage: {
    flex: 1,
    resizeMode: 'center',
  },
  gridContainer: {
    marginTop: verticalScale(20),
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  descText: {
    color: Colors.grey_500,
    textAlign: 'left',
    width: '70%',
    fontSize: verticalScale(12),
    marginTop: verticalScale(10),
  },
  itemImage: {
    height: verticalScale(25),
    width: verticalScale(25),
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  itemText: {
    fontSize: verticalScale(16),
    color: Colors.white,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.semiGray,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    height: '80%',
    marginTop: verticalScale(50),
    alignItems: 'center',
    borderTopRightRadius: verticalScale(30),
    borderTopLeftRadius: verticalScale(30),
    paddingBottom: verticalScale(60), // Adjust for bottom bar overlap
  },
  giftIconContainer: {
    height: verticalScale(120),
    width: verticalScale(120),
    resizeMode: 'contain',
    marginTop: verticalScale(-60),
  },
  questionContainer: {
    backgroundColor: Colors.white,
    height: verticalScale(35),
    width: verticalScale(35),
    borderRadius: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    position: 'absolute',
    right: 20,
    top: 20,
  },
  itemContainer: {
    width: verticalScale(50),
    height: verticalScale(50),
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: verticalScale(10),
    margin: horizontalScale(5),
  },
});