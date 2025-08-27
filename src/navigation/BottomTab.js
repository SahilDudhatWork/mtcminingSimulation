import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import MiningScreen from '../screens/MiningScreen/MiningScreen';
import RaferScreen from '../screens/RaferScreen/RaferScreen';
import RewardScreen from '../screens/Reward/RewardScreen';
import {horizontalScale, verticalScale} from '../constants/helper';
import {Images} from '../assets/images';
import {Colors} from '../constants/colors';

const Tab = createBottomTabNavigator();

const Bottom = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={index}
            style={[
              styles.mainItemContainer,
              {
                marginTop: label == 'MiningScreen' ? verticalScale(-80) : 0,
              },
            ]}>
            <Pressable
              onPress={onPress}
              style={[
                styles.tabButton,
                label == 'MiningScreen' && styles.centerTabButton,
                isFocused && label !== 'MiningScreen' && styles.focusedTabButton,
              ]}>
              <View style={styles.tabContent}>
                <View style={[
                  styles.iconContainer,
                  label === 'MiningScreen' && styles.centerIconContainer,
                  isFocused && label !== 'MiningScreen' && styles.focusedIconContainer,
                ]}>
                  <Image
                    style={[
                      styles.tabIcon,
                      label === 'MiningScreen' && styles.centerTabIcon,
                    ]}
                    source={
                      label === 'Rewards'
                        ? isFocused
                          ? Images.filledrewardsIcon
                          : Images.rewardsIcon
                        : label === 'Rafers'
                        ? Images.raferIcon
                        : Images.pickaxeIcon
                    }
                  />
                </View>
                {label !== 'MiningScreen' && (
                  <Text style={[
                    styles.tabLabel,
                    isFocused && styles.focusedTabLabel,
                  ]}>
                    {label}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName={'MiningScreen'}
      screenOptions={{headerShown: false}}
      tabBar={props => <Bottom {...props} />}>
      <Tab.Screen name="Rewards" component={HomeScreen} />
      <Tab.Screen name="MiningScreen" component={MiningScreen} />
      <Tab.Screen name="Rafers" component={RaferScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopRightRadius: verticalScale(20),
    borderTopLeftRadius: verticalScale(20),
    height: verticalScale(80),
    width: '100%',
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 1,
    borderColor: '#333B42',
  },
});
