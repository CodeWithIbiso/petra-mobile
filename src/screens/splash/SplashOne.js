import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import Lottie from 'lottie-react-native';

import assets from '../../assets';
import navigationNames from '../../navigationNames';
import {
  LinearGradientButton,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import {SplashNavigationHeader} from '../../components/elements/NavigationHeaders';
import {useSelector} from 'react-redux';

export default function SplashOne() {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const {themeStyle} = useSelector(state => state.app);

  const handleLevel = () => {
    navigation.navigate(navigationNames.SplashTwo);
  };
  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
      }}
      headerComponent={<SplashNavigationHeader position="one" />}>
      <View style={{flex: 0.9}}>
        <Text
          style={{
            marginTop: 60,
            fontWeight: 'bold',
            fontSize: 24,
            color: themeStyle.primaryText,
          }}>
          Save Locations
        </Text>
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          Now you can save popular spots right from your phone{' '}
        </Text>
        <Lottie
          style={{
            marginTop: 25,
            alignSelf: 'center',
            width: width - 50,
            height: width - 50,
          }}
          source={assets.splashScreenAnimationOne}
          autoPlay={true}
          loop={false}
        />
      </View>
      <View
        style={{
          flex: 0.3,
          marginBottom: 40,
          justifyContent: 'flex-end',
        }}>
        <LinearGradientButton title={'Get started'} onPress={handleLevel} />
      </View>
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
