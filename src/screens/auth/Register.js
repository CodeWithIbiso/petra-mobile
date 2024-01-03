import React, {useState} from 'react';
import {Image, Text, View, Alert} from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import forge from 'node-forge';
import {useDispatch, useSelector} from 'react-redux';

// import { SET_USER_CREDENTIALS} from '../../utils/graphql/queries';
import {setUser} from '../../store/user';
import images from '../../assets';
import {setPrivateKey, setPublicKey, setSecretKey} from '../../store/lock';
import {
  capitalizeFirstLetter,
  CustomTextInput,
  LinearGradientButton,
  SafeAreaMarginIncludedScreenWrapper,
} from '../../components/elements/utility';
import theme from '../../theme';
import navigationNames from '../../navigationNames';
import {REGISTER, SET_USER_CREDENTIALS} from '../../graphql/queries';

const initialInputData = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
};
const inputFieldKeys = {
  firstname: 'First Name',
  lastname: 'Last Name',
  username: 'Username',
  email: 'Email',
  password: 'Password',
};
export default function Register() {
  // KEYS
  const secretKey = useSelector(state => state.lock.secretKey);
  const publicKey = useSelector(state => state.lock.publicKey);
  const [keys, setKeys] = useState({
    secretKey,
    publicKey,
  });
  const create_set_Keys = () => {
    try {
      // Generate an RSA key pair with 2048-bit modulus using node-forge
      const keyPair = forge.pki.rsa.generateKeyPair(2048);
      // Convert the private key to PEM format
      const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
      // Convert the public key to PEM format
      const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
      // Create secret key for encrypting the private key
      const secretKey = CryptoJS?.lib?.WordArray?.random(32)?.toString();
      const encryptedPrivateKey = CryptoJS.AES.encrypt(
        privateKey,
        secretKey,
      ).toString();
      const encryptedPublicKey = CryptoJS.AES.encrypt(
        publicKey,
        'petra',
      ).toString();
      dispatch(setPrivateKey(encryptedPrivateKey));
      dispatch(setPublicKey(encryptedPublicKey));
      dispatch(setSecretKey(secretKey));
      return {
        publicKey: encryptedPublicKey,
        secretKey,
      };
    } catch (error) {}
  };

  const [userData, setUserData] = useState(initialInputData);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation();

  // MUTATION DEFINITION
  const [registerFunction, {data, loading, error, reset}] =
    useMutation(REGISTER);

  const [setUserCredentials, {reset: reset_}] =
    useMutation(SET_USER_CREDENTIALS);

  const setUserCredentialsFunc = () => {
    let newKeys;
    if (!keys?.publicKey || !keys?.secretKey) {
      newKeys = create_set_Keys();
      if (newKeys) {
        setKeys({
          secretKey: newKeys?.secretKey,
          publicKey: newKeys?.publicKey,
        });
      }
    }

    setUserCredentials({
      variables: {
        publicKey: keys.publicKey || newKeys?.publicKey,
        secretKey: keys.secretKey || newKeys?.secretKey,
      },
      onCompleted: res => {
        navigation.navigate(navigationNames.EmailVerification);
      },
      onError: err => {},
    });
  };
  const dispatch = useDispatch();
  const [isSecured, setIsSecured] = useState(true);
  const {themeStyle} = useSelector(state => state.app);

  const handleRegister = async () => {
    setIsSaving(true);
    try {
      await registerFunction({
        variables: {
          input: {...userData, email: userData.email.toLowerCase()},
        },
      }).then(response => {
        const user = response?.data?.signUp;
        if (user?.code !== 200) {
          Alert.alert(capitalizeFirstLetter(user?.message), [{text: 'Ok'}]);
          return;
        }
        const newUser = user.user;
        const token = user.token;
        const newUserData = {
          token,
          ...newUser,
        };
        dispatch(setUser(newUserData));
        if (user?.code == 200) {
          setUserCredentialsFunc();
        }
        reset(); //for formality sake
      });
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
      }}
      header>
      <View
        style={{marginBottom: 50, marginTop: -50, alignItems: 'flex-start'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              marginTop: 3,
              color: themeStyle.primaryText,
            }}>
            Join
          </Text>
          <Image
            resizeMode={'cover'}
            source={images.logoBlue}
            style={{
              width: 150,
              marginLeft: -15,
              height: 50,
              alignSelf: 'center',
              marginTop: 0,
            }}
          />
        </View>
        <Text
          style={{
            color: themeStyle.primaryText,
          }}>
          Hi There! It seems you don't have an account with us yet. Kindly fill
          up your details to get started. We'd love to have you!
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
        }}>
        {Object.keys(userData)?.map(userDataKey => (
          <CustomTextInput
            key={userDataKey}
            containerStyle={{}}
            textInputStyle={{marginHorizontal: 5}}
            secureTextEntry={userDataKey == 'password' && isSecured}
            value={userData[userDataKey]}
            onChangeText={e => setUserData({...userData, [userDataKey]: e})}
            placeholder={inputFieldKeys[userDataKey]}
            leftIcon={
              userDataKey == 'password' ? (
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  color={themeStyle.primaryText}
                  style={{marginRight: 10}}
                />
              ) : null
            }
            rightIcon={
              userDataKey != 'password' ? (
                <AntDesign
                  name="close"
                  size={17}
                  color={themeStyle.primaryText}
                  onPress={() => setUserData({...userData, [userDataKey]: ''})}
                />
              ) : (
                <Text
                  onPress={() => setIsSecured(!isSecured)}
                  style={{
                    textAlign: 'center',
                    color: theme.colors.blue,
                  }}>
                  {!isSecured ? 'hide' : 'show'}
                </Text>
              )
            }
          />
        ))}
        <LinearGradientButton
          onPress={handleRegister}
          title={'Create account'}
          loading={isSaving}
        />

        <View>
          <Text
            style={{
              marginTop: 25,
              textAlign: 'center',
              color: themeStyle.primaryText,
            }}>
            Sign up with your email address to get started. {'\n'}If you already
            have an account click on
            <Text
              onPress={() => navigation.navigate(navigationNames.Login)}
              style={{
                textAlign: 'center',
                color: theme.colors.blue,
              }}>
              {'  '}
              Login{'  '}
            </Text>
            to sign in to your account{' '}
          </Text>
        </View>
      </View>
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
