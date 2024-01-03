import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import LottieView from 'lottie-react-native';

import assets from '../../assets';
import navigationNames from '../../navigationNames';
import {
  LinearGradientButton,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import {SplashNavigationHeader} from '../../components/elements/NavigationHeaders';
import {useSelector} from 'react-redux';

export default function SplashTwo() {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {themeStyle} = useSelector(state => state.app);

  const handleLevel = () => {
    navigation.navigate(navigationNames.SplashThree);
  };
  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
      }}
      headerComponent={<SplashNavigationHeader position="two" />}>
      <View style={{flex: 0.9}}>
        <Text
          style={{
            fontWeight: 'bold',
            marginTop: 60,
            fontSize: 24,
            color: themeStyle.primaryText,
          }}>
          Make orders
        </Text>
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          Now you can make orders right from your phone{' '}
        </Text>

        <LottieView
          style={{
            marginTop: 25,
            alignSelf: 'center',
            width: width - 50,
            height: width - 50,
          }}
          source={assets.splashScreenAnimationTwo}
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
}
