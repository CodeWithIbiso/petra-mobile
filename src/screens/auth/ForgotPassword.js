import React, {useState} from 'react';
import {Alert, Text, TextInput, useWindowDimensions, View} from 'react-native';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useMutation} from '@apollo/client';

import theme from '../../theme';
import navigationNames from '../../navigationNames';
import {
  LinearGradientButton,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import assets from '../../assets';
import {REQUEST_PASSWORD_RESET} from '../../graphql/queries';

export default function EmailVerified() {
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setshowPassword] = useState(true);
  const {width} = useWindowDimensions();

  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
  const requestPasswordResetFunc = async () => {
    setIsProcessing(true);
    try {
      await requestPasswordReset({
        variables: {
          input: {
            email: email?.trim()?.toLowerCase(),
          },
        },
        onCompleted: async response => {
          setIsProcessing(false);
          const res = response?.forgotPasswordRequest;
          if (res?.code !== 200) {
            Alert.alert(res?.message, [{text: 'Ok'}]);
          } else {
            navigation.navigate(navigationNames.ResetPassword, {
              user: {...res?.user, password, email},
            });
          }
        },
        onError: error => {
          setIsProcessing(false);
        },
      });
    } catch (error) {}
  };

  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
      }}
      header>
      <LottieView
        style={{
          alignSelf: 'center',
          width: width,
          height: width,
        }}
        source={assets.forgotPasswordAnimation}
        autoPlay={false}
        loop={false}
      />

      <Text
        style={{
          fontSize: 24,
          color: themeStyle.primaryText,
          textAlign: 'center',
        }}>
        Reset Password
      </Text>
      <Text
        style={{
          color: themeStyle.primaryText,
          textAlign: 'center',
        }}>
        Kindly enter the email address you signed up with {`\n`} and a new
        password.
      </Text>
      <View style={{marginTop: 30, alignSelf: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: theme.colors.grey,
            borderBottomWidth: 1,
            minWidth: '100%',
            alignSelf: 'center',
          }}>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={e => setEmail(e)}
            placeholderTextColor={themeStyle.primaryText}
            style={{
              color: themeStyle.primaryText,
              flex: 1,
              height: 40,
            }}
          />
          <AntDesign
            name="close"
            size={17}
            color={themeStyle.primaryText}
            onPress={() => setEmail('')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
            borderBottomColor: theme.colors.grey,
            borderBottomWidth: 1,
            minWidth: '100%',
            alignSelf: 'center',
          }}>
          <TextInput
            secureTextEntry={showPassword}
            value={password}
            onChangeText={e => setPassword(e)}
            placeholder="Password"
            placeholderTextColor={themeStyle.primaryText}
            style={{
              color: themeStyle.primaryText,
              flex: 1,
              height: 40,
            }}
          />

          <Text
            onPress={() => setshowPassword(!showPassword)}
            style={{
              textAlign: 'center',
              color: theme.colors.blue,
            }}>
            {!showPassword ? 'hide' : 'show'}
          </Text>
        </View>
      </View>
      <LinearGradientButton
        onPress={requestPasswordResetFunc}
        title={'Reset'}
        loading={isProcessing}
        style={{marginTop: 40}}
      />
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
