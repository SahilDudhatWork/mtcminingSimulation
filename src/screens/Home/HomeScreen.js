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

  const [list, setList] = useState([
    {value: 10, opened: false},
    {value: 20, opened: false},
    {value: 35, opened: false},
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [giftAmt, setGiftAmt] = useState(0);
  const [masterCoin, setMasterCoin] = useState(0);
  const [isGiftMining, setIsGiftMining] = useState(false);
  const [giftTimeRemaining, setGiftTimeRemaining] = useState(0);
  const [giftIntervalId, setGiftIntervalId] = useState(null);
  const GIFT_DURATION_MS = 1 * 60 * 1000; // 1 minutes in milliseconds

  useEffect(() => {
    const focusListener = navigation.addListener('focus', async () => {
      const totalMasterCoin = await AsyncStorage.getItem('masterCoin');
      if (totalMasterCoin) {
        setMasterCoin(parseFloat(totalMasterCoin) || 0);
      }
      const getBoxList = await AsyncStorage.getItem('boxList');
      if (getBoxList != null) {
        const list = JSON.parse(getBoxList);
        console.log('Retrieved list:', list);
        setList(list);
      } else {
        setList([
          {value: 10, opened: false},
          {value: 20, opened: false},
          {value: 35, opened: false},
        ]);
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
        console.log('giftStoredSession', giftStoredSession);
        if (giftStoredSession) {
          const sessionStart = new Date(parseInt(giftStoredSession));
          const now = new Date();
          const elapsedTime = now - sessionStart;
          console.log(
            'elapsedTime < GIFT_DURATION_MS',
            elapsedTime < GIFT_DURATION_MS,
          );
          if (elapsedTime < GIFT_DURATION_MS) {
            setIsGiftMining(true);
            setGiftTimeRemaining(GIFT_DURATION_MS - elapsedTime);
          } else {
            await AsyncStorage.removeItem('giftOpenStart');
            await AsyncStorage.removeItem('boxList');
            setIsGiftMining(false);
            setGiftTimeRemaining(0);
            setList([
              {value: 10, opened: false},
              {value: 20, opened: false},
              {value: 35, opened: false},
            ]);
          }
        } else {
          await AsyncStorage.removeItem('boxList');
          setIsGiftMining(false);
          setGiftTimeRemaining(0);
          setList([
            {value: 10, opened: false},
            {value: 20, opened: false},
            {value: 35, opened: false},
          ]);
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
            setList([
              {value: 10, opened: false},
              {value: 20, opened: false},
              {value: 35, opened: false},
            ]);
            clearInterval(giftMiningIntervalId);
          }
          return newTimeRemaining;
        });
      }, 1000); // Update earnings every second

      setGiftIntervalId(giftMiningIntervalId);
    }

    return () => clearInterval(giftIntervalId);
  }, [isGiftMining, giftTimeRemaining]);

  const openBox = async i => {
    setIsVisible(true);
    const randomAmount = await getRandomInt(10, 200);
    setGiftAmt(randomAmount);

    let Array = list;
    Array[i].value = randomAmount;
    Array[i].opened = true;

    setList([...Array]);
    AsyncStorage.setItem('boxList', JSON.stringify(list));
    console.log('isGiftMining', isGiftMining);
    if (!isGiftMining) {
      const now = new Date().getTime();
      console.log('now.toString()', now.toString());
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
    const handlePress = () => {
      if (!item.opened) {
        openBox(index);
      }
    };

    return (
      <Pressable
        onPress={handlePress} // Call only if !item.opened
        style={[
          styles.itemContainer,
          {
            marginHorizontal: index === 1 ? horizontalScale(25) : 0,
            opacity: item.opened ? 0.5 : 1, // Visually indicate disabled state
          },
        ]}
        disabled={item.opened} // Disable pressable if the item is already opened
      >
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
        onPress={() => {
          props.navigation.navigate('HelpScreen');
        }}>
        <Image style={styles.queImage} source={Images.Question} />
      </Pressable>
      <View style={styles.innerContainer}>
        <Image style={styles.giftIconContainer} source={Images.presentIcon} />
        <Text style={styles.titleText}>Flip & Win</Text>
        <Text style={styles.descText1}>
          {'You will win the super coins by playing\na simple game'}
        </Text>
        <View style={styles.pointContainer}>
          <Image style={styles.starImage} source={Images.starIcon} />
          <Text style={styles.pointText}>{masterCoin}</Text>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ConvertCoinScreen')}
          style={[
            styles.touchContainer,
            {backgroundColor: Colors.secondaryColor},
          ]}>
          <Text style={styles.fs10}>Convert to USDT</Text>
        </TouchableOpacity>
        <View
          style={[
            styles.touchContainer,
            {backgroundColor: 'rgba(42, 63, 189, 0.60)'},
          ]}>
          <Text style={styles.fs10}>Flip a Card</Text>
        </View>
        <View style={styles.h120}>
          <FlatList
            data={list}
            renderItem={renderItem}
            numColumns={3}
            style={styles.mt30}
            contentContainerStyle={styles.h70}
          />
        </View>
        <Text style={styles.descText}>
          * You can flip only 3 cards at a time. Once you flip all the cards you
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
  fs10: {
    fontSize: verticalScale(10),
  },
  touchContainer: {
    padding: verticalScale(7),
    marginTop: verticalScale(10),
    borderRadius: verticalScale(10),
  },
  descText1: {
    color: Colors.grey_500,
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  titleText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: verticalScale(15),
    marginTop: verticalScale(15),
  },
  queImage: {
    flex: 1,
    resizeMode: 'center',
  },
  h70: {
    height: verticalScale(70),
  },
  mt30: {
    marginTop: verticalScale(30),
  },
  h120: {
    height: verticalScale(120),
  },
  descText: {
    color: Colors.grey_500,
    textAlign: 'left',
    width: '70%',
    fontSize: verticalScale(12),
  },
  itemImage: {
    height: verticalScale(25),
    width: verticalScale(25),
    resizeMode: 'contain',
    tintColor: Colors.grey_400,
  },
  itemText: {
    fontSize: verticalScale(20),
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
    height: '67%',
    marginTop: verticalScale(180),
    alignItems: 'center',
    borderTopRightRadius: verticalScale(30),
    borderTopLeftRadius: verticalScale(30),
  },
  giftIconContainer: {
    height: verticalScale(150),
    width: verticalScale(150),
    resizeMode: 'contain',
    marginTop: verticalScale(-85),
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
    width: verticalScale(70),
    height: verticalScale(70),
    backgroundColor: Colors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: verticalScale(15),
  },
});
