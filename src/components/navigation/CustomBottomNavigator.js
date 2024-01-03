import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import navigationNames from '../../navigationNames';
import {useDispatch, useSelector} from 'react-redux';
import {setScrollDirection} from '../../store/app';
import {switchNavigation} from '../../store/app';
import theme from '../../theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {capitalizeFirstLetter} from '../elements/utility';

export default CustomBottomNavigator = () => {
  const [isOnFirstVisit, setIsOnFirstVisit] = useState(true);
  const [isActive, setIsActive] = useState('home');

  const themeStyle = useSelector(state => state.app.themeStyle);
  const activeState = useSelector(state => state?.app?.navigation);
  const scrollDirection = useSelector(state => state?.app?.scrollDirection);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  const iconSize = 25;

  const handleNavigateScreen = screenName => {
    setIsOnFirstVisit(false);
    dispatch(switchNavigation(screenName));
    navigation.navigate(navigationNames[capitalizeFirstLetter(screenName)]);
  };

  const progress = useSharedValue(0);
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: progress.value,
    };
  }, []);

  // set the first active tab to the home page on every first visit
  useEffect(() => {
    if (isOnFirstVisit) {
      dispatch(setScrollDirection('up'));
      setIsActive('home');
    } else {
      setIsActive(
        Object.keys(activeState)?.find(state => activeState[state] == true),
      );
    }
  }, [activeState]);

  // handle toggle bottom navigation display
  const handleToggleBottomNavigationDisplay = direction => {
    if (direction == 'down') {
      progress.value = withTiming(-90);
    } else {
      progress.value = withTiming(0);
    }
  };

  useEffect(() => {
    // toggle bottom navigation based on scroll direction
    handleToggleBottomNavigationDisplay(scrollDirection);
  }, [scrollDirection]);

  const MenuItem = ({navigationName, MenuIcon}) => {
    const currentMenuItemName = navigationName.toLowerCase();
    return (
      <TouchableOpacity
        onPress={() => handleNavigateScreen(currentMenuItemName)}
        style={{alignItems: 'center', height: 80, justifyContent: 'center'}}>
        {isActive == currentMenuItemName && (
          <View
            style={{
              backgroundColor: theme.colors.green,
              height: 5,
              width: 20,
              position: 'absolute',
              top: 0,
            }}
          />
        )}
        {MenuIcon}
        <Text
          style={{
            fontSize: 10,
            color: themeStyle.primaryText,
          }}>
          {navigationName}
        </Text>
      </TouchableOpacity>
    );
  };

  const menuItems = [
    {
      navigationName: navigationNames.Home,
      MenuIcon: (
        <MaterialCommunityIcons
          name="home"
          size={iconSize}
          color={themeStyle.primaryText}
        />
      ),
    },
    {
      navigationName: navigationNames.Spots,
      MenuIcon: (
        <FontAwesome
          name="location-arrow"
          size={iconSize}
          color={themeStyle.primaryText}
        />
      ),
    },
    {
      navigationName: navigationNames.Notifications,
      MenuIcon: (
        <View>
          <View
            style={{
              backgroundColor: theme.colors.red,
              height: 10,
              width: 10,
              position: 'absolute',
              top: 0,
              zIndex: 1,
              right: 0,
              borderRadius: 100,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.light,
              }}>
              7
            </Text>
          </View>
          <Ionicons
            name="notifications"
            size={iconSize}
            color={themeStyle.primaryText}
          />
        </View>
      ),
    },
    {
      navigationName: navigationNames.Settings,
      MenuIcon: (
        <FontAwesome
          name="cogs"
          size={iconSize}
          color={themeStyle.primaryText}
        />
      ),
    },
  ];
  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 20,
          alignItems: 'center',
          height: 80,
          width: width,
          backgroundColor: themeStyle?.bgColor,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: themeStyle.card,
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        reanimatedStyle,
      ]}>
      {menuItems.map((menuItem, index) => (
        <MenuItem
          key={index}
          navigationName={menuItem.navigationName}
          MenuIcon={menuItem.MenuIcon}
        />
      ))}
    </Animated.View>
  );
};
