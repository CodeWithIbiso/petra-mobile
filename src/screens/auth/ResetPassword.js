import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text, useWindowDimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OTPTextInput from 'react-native-otp-textinput';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {useMutation} from '@apollo/client';

import theme from '../../theme';
import {setUser} from '../../store/user';
import navigationNames from '../../navigationNames';
import {
  AuthModalFailed,
  AuthModalSuccess,
  LinearGradientButton,
  maskEmail,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import assets from '../../assets';
import {REQUEST_PASSWORD_RESET, RESET_PASSWORD} from '../../graphql/queries';

export default function ResetPassword(props) {
  const navigation = useNavigation();
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const [modalShown, setModalShown] = useState(false);
  const [modalHasShown, setModalHasShown] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();

  const user = props?.route?.params?.user;

  const passwordResetToken = useRef();
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
  const requestPasswordResetFunc = async () => {
    try {
      await requestPasswordReset({
        variables: {
          input: {
            email: user?.email?.trim()?.toLowerCase(),
          },
        },
        onCompleted: async response => {
          const res = response?.forgotPasswordRequest;
          if (res?.code !== 200) {
            Alert.alert(res?.message, [{text: 'Ok'}]);
          } else {
            Alert.alert(
              'Success',
              'We have re-sent an email verification code to your email. Please check your email and try again',
              [{text: 'Ok'}],
            );
          }
        },
        onError: error => {},
      });
    } catch (error) {}
  };

  const lottieRef = useRef();

  const handleVerify = () => {
    lottieRef.current.pause();
    setModalShown(true);
    setModalHasShown(true);
    //
  };
  const handleResend = () => {
    lottieRef.current.play();
    requestPasswordResetFunc();
  };

  useEffect(() => {
    !modalShown &&
      modalHasShown &&
      success &&
      setTimeout(() => {
        navigation.navigate(navigationNames.BottomNavigation);
      }, 500);
  }, [modalShown]);

  const resetPasswordFunc = async () => {
    setIsProcessing(true);
    try {
      await resetPassword({
        variables: {
          input: {
            paswordResetCode: Number(passwordResetToken.current),
            id: user?.id,
            password: user?.password,
          },
        },
        onCompleted: async response => {
          setIsProcessing(false);
          const res = response?.resetPassword;
          const token = res.token;
          if (res?.code !== 200) {
            setSuccess(false);
            handleVerify();
            Alert.alert(res?.message, [{text: 'Ok'}]);
          } else {
            dispatch(
              setUser({
                token,
                ...res?.user,
              }),
            );
            setSuccess(true);
            handleVerify();
          }
        },
        onError: error => {
          setIsProcessing(false);
        },
      });
    } catch (error) {
      setIsProcessing(false);
    }
  };
  const handleInputChange = async input => {
    passwordResetToken.current = input;
    if (input.length == 5) {
      resetPasswordFunc();
    }
  };
  return (
    <SafeAreaMarginIncludedScreenWrapper
      header
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <View>
        {success ? (
          <AuthModalSuccess
            modalShown={modalShown}
            setModalShown={setModalShown}
          />
        ) : (
          <AuthModalFailed
            modalShown={modalShown}
            setModalShown={setModalShown}
          />
        )}
      </View>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 24,
          marginTop: 40,
          color: themeStyle.primaryText,
        }}>
        Check your mail
      </Text>
      <Text
        style={{
          fontWeight: '400',
          color: themeStyle.primaryText,
        }}>
        We have sent a password recovery code to your email
        {'\n'}
        {maskEmail(user?.email)}
      </Text>
      <LottieView
        ref={lottieRef}
        style={{
          alignSelf: 'center',
          width: width,
          height: width,
        }}
        source={assets.emailSentAnimation}
        autoPlay={true}
        loop={false}
      />
      <View style={{alignSelf: 'center'}}>
        <OTPTextInput
          handleTextChange={handleInputChange}
          inputCount={5}
          textInputStyle={{
            borderWidth: 1,
            color: themeStyle.primaryText,
            borderRadius: 10,
            borderBottomWidth: 1,
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
            color: themeStyle.primaryText,
          }}>
          Didn't receive code?
          <Text
            onPress={handleResend}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.colors.blue,
            }}>
            {' '}
            Resend
          </Text>
        </Text>
      </View>
      <LinearGradientButton
        title={'Verify'}
        loading={isProcessing}
        onPress={resetPasswordFunc}
        style={{
          marginTop: 40,
        }}
      />
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
