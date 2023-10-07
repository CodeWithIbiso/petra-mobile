import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import theme from '../../theme';
import assets from '../../assets';
import LottieView from 'lottie-react-native';
import navigationNames from '../../navigationNames';

export default function Splash() {
  const navigation = useNavigation();
  const handleNavigation = () => {
    navigation.navigate(navigationNames.SplashOne);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <LottieView
        speed={0.7}
        style={{
          alignSelf: 'center',
          width: 100,
          height: 100,
        }}
        source={assets.splashScreenAnimation}
        autoPlay={true}
        loop={false}
        onAnimationFinish={() =>
          setTimeout(() => {
            handleNavigation();
          }, 1000)
        }
      />
      <Text
        style={{
          marginTop: -15,
          fontWeight: 'bold',
          color: theme.colors.darkGrey,
          fontFamily: theme.fontFamily.ios['215'],
        }}>
        Save your favourite places...
      </Text>
    </View>
  );
}
