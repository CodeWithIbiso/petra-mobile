import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text, useWindowDimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OTPTextInput from 'react-native-otp-textinput';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {useMutation} from '@apollo/client';
import {setUser} from '../../store/user';

import {
  AuthModalFailed,
  AuthModalSuccess,
  LinearGradientButton,
  maskEmail,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import navigationNames from '../../navigationNames';
import theme from '../../theme';
import assets from '../../assets';
import {RESEND_EMAIL_VERIFICATION, VERIFY_EMAIL} from '../../graphql/queries';

export default function EmailVerification() {
  const navigation = useNavigation();
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const user = useSelector(state => state?.user?.user);
  const [modalShown, setModalShown] = useState(false);
  const [modalHasShown, setModalHasShown] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const token = useRef();
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();

  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [resendEmailVerification] = useMutation(RESEND_EMAIL_VERIFICATION);

  const resendEmailVerificationFunc = async () => {
    try {
      await resendEmailVerification({
        onCompleted: async response => {
          const res = response?.resendVerificationCode;
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
    setModalShown(true);
    setModalHasShown(true);
  };
  const handleResend = () => {
    lottieRef.current.play();
    resendEmailVerificationFunc();
  };

  const verifyEmailFunc = async () => {
    setIsProcessing(true);
    try {
      await verifyEmail({
        variables: {verificationCode: Number(token.current)},
        onCompleted: async response => {
          setIsProcessing(false);
          const res = response?.verifyUserAccount;
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
    token.current = input;
    if (input.length == 5) {
      verifyEmailFunc();
    }
  };
  return (
    <SafeAreaMarginIncludedScreenWrapper
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
          fontSize: 24,
          fontWeight: 'bold',
          color: themeStyle.primaryText,
        }}>
        Account Created
      </Text>
      <Text
        style={{
          color: themeStyle.primaryText,
        }}>
        We have sent a verification code to your email
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
            color: themeStyle.primaryText,
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
        onPress={verifyEmailFunc}
        style={{
          marginTop: 40,
        }}
      />
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
