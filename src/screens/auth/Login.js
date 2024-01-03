import React, {useEffect, useState} from 'react';
import {Alert, Image, Text, useWindowDimensions, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {useDispatch, useSelector} from 'react-redux';

import theme from '../../theme';
import {setUser} from '../../store/user';

import {setAppState} from '../../store/app';
import assets from '../../assets';
import {
  CustomTextInput,
  LinearGradientButton,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import navigationNames from '../../navigationNames';
import {LOGIN} from '../../graphql/queries';

export default function Login() {
  const dispatch = useDispatch();
  const appState = useSelector(state => state?.app?.appState);
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [secured, setSecured] = useState(true);

  const {themeStyle, theme: theme_mode} = useSelector(state => state.app);

  const initialData = {
    email: '',
    password: '',
  };
  const [userData, setUserData] = useState(initialData);

  const [loginFunction, {reset}] = useMutation(LOGIN);

  const handleLogin = async () => {
    const email = userData.email.toLowerCase();
    const password = userData.password;
    if (!email || !password) return;
    const input = {...userData, email};
    setIsProcessing(true); //
    try {
      await loginFunction({
        variables: {
          input,
        },
      })
        .then(response => {
          setIsProcessing(false);
          const token = response?.data?.signIn?.token;
          const code = response?.data?.signIn?.code;
          const message = response?.data?.signIn?.message;
          const user = response?.data?.signIn?.user;
          const newUserData = {
            token,
            ...user,
          };
          if (code !== 200) {
            Alert.alert('Login Failed!', message, [{text: 'Ok'}]);
          } else {
            dispatch(setUser(newUserData));
            if (user.emailVerified != true) {
              navigation.navigate(navigationNames.EmailVerification);
            }
          }
          reset();
        })
        .catch(err => {
          setIsProcessing(false);
          Alert.alert(
            'Login Failed!',
            'An error occured while trying to sign you in. Please check your internet connection and try again',
            [{text: 'Ok'}],
          );
        });
    } catch (error) {}
  };

  // useEffect(() => {
  //   appState == 'background' && dispatch(setAppState('active'));
  // }, [appState]);
  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <Image
        resizeMode={'cover'}
        source={assets.logoBlue}
        style={{width: 150, height: 50, alignSelf: 'center', marginTop: -50}}
      />
      <Text
        style={{
          fontSize: 24,
          marginTop: 50,
          color: themeStyle.primaryText,
        }}>
        LOGIN
      </Text>
      <Text
        style={{
          marginBottom: 20,
          marginTop: 5,
          color: themeStyle.primaryText,
        }}>
        Welcome back! Please enter your details
      </Text>
      <View
        style={{
          marginTop: 10,
          backgroundColor: 'transparent',
          alignItems: 'center',
        }}>
        <CustomTextInput
          containerStyle={{}}
          textInputStyle={{marginHorizontal: 5}}
          value={userData.email}
          onChangeText={e => setUserData({...userData, email: e})}
          placeholder={'Email or Phone'}
          leftIcon={
            <MaterialCommunityIcons
              name="account"
              size={15}
              color={themeStyle.primaryText}
            />
          }
          rightIcon={
            <AntDesign
              name="close"
              color={themeStyle.primaryText}
              size={15}
              onPress={() => setUserData({...userData, email: ''})}
            />
          }
        />
        <CustomTextInput
          containerStyle={{}}
          secureTextEntry={secured}
          textInputStyle={{marginHorizontal: 5}}
          value={userData.password}
          onChangeText={e => setUserData({...userData, password: e})}
          placeholder={'Password'}
          leftIcon={
            <MaterialCommunityIcons
              name="lock"
              color={themeStyle.primaryText}
              size={15}
            />
          }
          rightIcon={
            <Text
              onPress={() => setSecured(!secured)}
              style={{
                textAlign: 'center',
                marginTop: 0,
                color: theme.colors.blue,
              }}>
              show
            </Text>
          }
        />
        <LinearGradientButton
          title={'Sign in'}
          loading={isProcessing}
          onPress={handleLogin}
        />
        <Text
          onPress={() => navigation.navigate(navigationNames.ForgotPassword)}
          style={{
            textAlign: 'center',
            marginTop: 5,
            color: themeStyle.primaryText,
          }}>
          Forgot password?
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            flex: 1,
            height: 0.5,
            backgroundColor: theme.colors.black,
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            marginHorizontal: 5,
            marginVertical: 10,
            color: themeStyle.primaryText,
          }}>
          or
        </Text>
        <View
          style={{
            flex: 1,
            height: 0.5,
            backgroundColor: theme.colors.black,
          }}
        />
      </View>

      <View style={{backgroundColor: 'transparent', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            height: 40,
            width: '100%',
            borderRadius: 50,
            borderWidth: 0.17,
            borderColor: theme.colors.black,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image style={{width: 30, height: 30}} source={assets.googleLogo} />
          <Text
            onPress={() => {}}
            style={{
              marginLeft: 10,
              textAlign: 'center',
              marginTop: 0,
              color: themeStyle.primaryText,
            }}>
            Sign in with Google
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 25,
            height: 40,
            width: '100%',
            borderRadius: 50,
            borderWidth: 0.17,
            borderColor: theme.colors.black,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 30, height: 30}}
            source={theme_mode == 'light' ? assets.appleLogo : assets.appleDark}
          />
          <Text
            onPress={() => {}}
            style={{
              marginLeft: 10,
              textAlign: 'center',
              marginTop: 0,
              color: themeStyle.primaryText,
            }}>
            Sign in with Apple
          </Text>
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 5,
            color: themeStyle.primaryText,
          }}>
          {' '}
          Don't have an account?
        </Text>
        <Text
          onPress={() => navigation.navigate(navigationNames.Register)}
          style={{
            marginLeft: 10,
            textAlign: 'center',
            marginTop: 5,
            color: theme.colors.blue,
          }}>
          Sign up
        </Text>
      </View>
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
