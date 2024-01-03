import React, {useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

import theme from '../../theme';
import AuthBackArrowHeader from './NavigationHeaders';
import assets from '../../assets';

export const AuthModalSuccess = ({modalShown, setModalShown}) => {
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const {width} = useWindowDimensions();
  const values = {
    iconUri: assets.modalSuccessAnimation,
    text: 'Continue',
    background: [theme.colors.blue, theme.colors.blue, theme.colors.green],
  };

  const toggleModal = () => {
    setModalShown(!modalShown);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Modal isVisible={modalShown}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              width: width,
              height: width,
              backgroundColor: themeStyle.bgColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              style={{
                width: width / 2,
                height: width / 2,
              }}
              source={values?.iconUri}
              autoPlay={true}
              loop={false}
            />
            <TouchableOpacity onPress={toggleModal}>
              <LinearGradient
                start={{x: 0.0, y: 0.45}}
                end={{x: 0.5, y: 4.0}}
                locations={[0.1, 0.2, 1]}
                style={{
                  height: 55,
                  alignSelf: 'center',
                  width: width - 50,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 40,
                }}
                colors={values?.background}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: theme.fontFamily.ios['191'],
                    fontWeight: '400',
                    fontSize: 16,
                    marginTop: 0,
                    color: theme.colors.white,
                  }}>
                  {values?.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export const AuthModalFailed = ({modalShown, setModalShown}) => {
  const {width} = useWindowDimensions();
  const themeStyle = useSelector(state => state?.app?.themeStyle);
  const values = {
    iconUri: assets.modalFailedAnimation,
    text: 'Try again',
    background: [theme.colors.red, theme.colors.red, theme.colors.green],
  };

  const toggleModal = () => {
    setModalShown(!modalShown);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Modal isVisible={modalShown}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: width,
              height: width,
              backgroundColor: themeStyle.bgColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              style={{
                // flex:1,
                width: width / 2,
                height: width / 2,
              }}
              source={values?.iconUri}
              autoPlay={true}
              loop={false}
            />
            <TouchableOpacity onPress={toggleModal}>
              <LinearGradient
                start={{x: 0.0, y: 0.45}}
                end={{x: 0.5, y: 4.0}}
                locations={[0.1, 0.2, 1]}
                style={{
                  height: 55,
                  alignSelf: 'center',
                  width: width - 50,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 40,
                }}
                colors={values?.background}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: theme.fontFamily.ios['191'],
                    fontWeight: '400',
                    fontSize: 16,
                    marginTop: 0,
                    color: theme.colors.white,
                  }}>
                  {values?.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const LimitedText = ({text, limit, comp, ...props}) => {
  const truncatedText = text ? text?.substring(0, limit) : '';

  return (
    <Text {...props}>
      {truncatedText}
      {text?.length > limit && '...'}
      {comp}
    </Text>
  );
};

export const CustomTextInput = ({
  containerStyle,
  textInputStyle,
  secureTextEntry,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
}) => {
  const {themeStyle} = useSelector(state => state.app);
  const LeftIcon = () => leftIcon;
  const RightIcon = () => rightIcon;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        height: 50,
        borderRadius: 15,
        backgroundColor: themeStyle.textInputColor,
        paddingHorizontal: 10,
        ...containerStyle,
      }}>
      <LeftIcon />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={{
          flex: 1,
          color: themeStyle.primaryText,
          ...textInputStyle,
        }}
        placeholderTextColor={theme.colors.textInputPlaceholderColor}
        placeholder={placeholder}
      />
      <RightIcon />
    </View>
  );
};

export const SafeAreaMarginIncludedScreenWrapper = ({
  header,
  children,
  headerComponent,
  style,
  contentContainerStyle,
}) => {
  const {themeStyle} = useSelector(state => state.app);
  const SIZE = 25;

  const Header = () => {
    return (
      headerComponent || (
        <View
          style={{
            paddingLeft: SIZE,
          }}>
          <AuthBackArrowHeader />
        </View>
      )
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: themeStyle.bgColor, ...style}}>
      {header || headerComponent ? <Header /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: SIZE,
        }}
        contentContainerStyle={contentContainerStyle}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export const LinearGradientButton = ({title, loading, onPress, style}) => {
  const {width} = useWindowDimensions();
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <LinearGradient
        start={{x: 0.0, y: 0.45}}
        end={{x: 0.5, y: 4.0}}
        locations={[0.1, 0.2, 1]}
        style={{
          height: 55,
          alignSelf: 'center',
          width: width - 50,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        colors={[theme.colors.dark, theme.colors.dark, theme.colors.blue]}>
        {!loading ? (
          <Text
            style={{
              textAlign: 'center',
              color: theme.colors.white,
            }}>
            {title}
          </Text>
        ) : (
          <ActivityIndicator />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const capitalizeFirstLetter = inputString => {
  if (!inputString) {
    return inputString;
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

export const CustomApolloProvider = props => {
  const token = useSelector(state => state?.user?.user?.token);
  const client = useMemo(() => {
    const authLink = setContext((_, {headers}) => {
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    const httpLink = createHttpLink({
      uri: 'http://localhost:4000/graphql',
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [token]);
  return <ApolloProvider client={client} {...props} />;
};

export const maskEmail = email => {
  // Split the email into username and domain
  const [username, domain] = email.split('@');
  // Check if the username has at least 3 characters
  if (username.length < 3) {
    return email; // Not enough characters to obscure, return the original email
  }
  // Replace characters in the username with asterisks
  const obscuredUsername =
    username.charAt(0) + '***' + username.charAt(username.length - 1);
  // Combine the obscured username with the domain
  const maskedEmail = obscuredUsername + '@' + domain;
  return maskedEmail;
};
