import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Lottie from 'lottie-react-native';

import navigationNames from '../../navigationNames';
import {SplashNavigationHeader} from '../../components/elements/NavigationHeaders';
import {
  LinearGradientButton,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import assets from '../../assets';
import {setSplashHasShown} from '../../store/app';

export default SplashThree = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const {themeStyle} = useSelector(state => state.app);

  const handleLevel = () => {
    dispatch(setSplashHasShown());
    navigation.navigate(navigationNames.Login);
  };
  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
      }}
      headerComponent={<SplashNavigationHeader position="three" />}>
      <View style={{flex: 0.9}}>
        <Text
          style={{
            fontWeight: 'bold',
            marginTop: 60,
            fontSize: 24,
            color: themeStyle.primaryText,
          }}>
          Grow your business{' '}
        </Text>
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          Now you can grow your business right from your phone{' '}
        </Text>
        <Lottie
          speed={0.9}
          style={{
            marginTop: 25,
            alignSelf: 'center',
            width: width - 50,
            height: width - 50,
          }}
          source={assets.splashScreenAnimationThree}
          autoPlay={true}
          loop={true}
        />
      </View>
      <View
        style={{
          flex: 0.3,
          marginBottom: 40,
          justifyContent: 'flex-end',
        }}>
        <LinearGradientButton title={'Continue'} onPress={handleLevel} />
      </View>
    </SafeAreaMarginIncludedScreenWrapper>
  );
};
