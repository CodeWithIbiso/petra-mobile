import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Divider, Switch} from 'react-native-paper';
import theme from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../store/user';
import {setInitalState, setTheme, switchNavigation} from '../../store/app';
import navigationNames from '../../navigationNames';
import {SafeAreaMarginIncludedScreenWrapper} from '../../components/elements/utility';

const User = ({navigation, themeStyle}) => {
  const {image, username} = useSelector(state => state?.user?.user);
  return (
    <View
      style={{
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigation.closeDrawer()}
        style={{flexDirection: 'row-reverse'}}>
        <AntDesign name={'close'} size={25} color={themeStyle.primaryText} />
      </TouchableOpacity>
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 100,
            width: 100,
            marginTop: 10,
            borderRadius: 100,
            backgroundColor: theme.colors.cardLight,
            borderColor: theme.colors.cardLight,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderWidth: 5,
          }}>
          {image ? (
            <Image
              resizeMode="cover"
              style={{height: 90, width: 90}}
              source={{uri: image}}
            />
          ) : (
            <FontAwesome5
              color={theme.colors.cardDark}
              name="user-alt"
              size={90}
              style={{zIndex: -10}}
            />
          )}
        </View>
        <Text
          style={{
            marginTop: 10,
            color: themeStyle.primaryText,
          }}>
          {username}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <EvilIcons
            name={'location'}
            size={12}
            color={theme.colors.red}
            style={{marginHorizontal: 2}}
          />
          <Text
            style={{
              fontWeight: '300',
              color: themeStyle.primaryText,
            }}>
            23 Spots . Visited 12
          </Text>
        </View>
      </View>
    </View>
  );
};

const Menus = ({props, themeStyle}) => {
  const dispatch = useDispatch();
  const navigation = props.navigation;
  const appTheme = useSelector(state => state.app.theme);
  const handleLogout = () => {
    dispatch(switchNavigation('home'));
    dispatch(logoutUser());
    dispatch(setInitalState());
    navigation.closeDrawer();
  };
  const bottom = 20;
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (appTheme == 'light') {
      dispatch(setTheme('dark'));
    } else {
      dispatch(setTheme('light'));
    }
  };
  return (
    <View style={{flex: 1, marginVertical: 20}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}
        onPress={() => navigation.navigate(navigationNames.Home)}>
        <FontAwesome5 name={'home'} size={20} color={themeStyle.primaryText} />
        <Text
          style={{
            flex: 0.8,

            color: themeStyle.primaryText,
          }}>
          Home
        </Text>
        <SimpleLineIcons
          name={'arrow-right'}
          size={10}
          color={theme.colors.dark}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}
        onPress={() => navigation.navigate('Account')}>
        <FontAwesome
          name={'user-circle-o'}
          size={20}
          color={themeStyle.primaryText}
        />
        <Text
          style={{
            flex: 0.8,

            color: themeStyle.primaryText,
          }}>
          Account
        </Text>
        <SimpleLineIcons
          style={{}}
          name={'arrow-right'}
          size={10}
          color={theme.colors.dark}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}
        onPress={() => navigation.navigate(navigationNames.SavedSpots)}>
        <MaterialIcons
          name={'bookmarks'}
          size={20}
          color={themeStyle.primaryText}
        />
        <Text
          style={{
            flex: 0.8,
            color: themeStyle.primaryText,
          }}>
          Saved
        </Text>
        <SimpleLineIcons
          name={'arrow-right'}
          size={10}
          color={theme.colors.dark}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}
        onPress={() => navigation.navigate(navigationNames.Chats)}>
        <Ionicons
          style={{}}
          name="chatbox-ellipses"
          size={20}
          color={themeStyle.primaryText}
        />
        <Text
          style={{
            flex: 0.8,

            color: themeStyle.primaryText,
          }}>
          Chat
        </Text>
        <SimpleLineIcons
          name={'arrow-right'}
          size={10}
          color={theme.colors.dark}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}
        onPress={toggleSwitch}>
        {!isEnabled ? (
          <MaterialIcons
            name={'sunny'}
            size={20}
            color={themeStyle.primaryText}
          />
        ) : (
          <Ionicons
            name={'moon-outline'}
            size={20}
            color={themeStyle.primaryText}
          />
        )}
        <Text
          style={{
            flex: 0.8,

            color: themeStyle.primaryText,
          }}>
          Dark Mode
        </Text>
        <Switch
          trackColor={{
            false: themeStyle.primaryText,
            true: theme.colors.blue,
          }}
          style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
          thumbColor={appTheme == 'light' ? theme.colors.white : '#f4f3f4'}
          ios_backgroundColor={themeStyle.primaryText}
          onValueChange={toggleSwitch}
          value={appTheme == 'light' ? false : true}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}
        onPress={() => handleLogout()}>
        <AntDesign name={'logout'} size={20} color={themeStyle.primaryText} />
        <Text
          style={{
            flex: 0.8,
            color: themeStyle.primaryText,
          }}>
          Log out
        </Text>
        <SimpleLineIcons
          name={'arrow-right'}
          size={10}
          color={theme.colors.dark}
        />
      </TouchableOpacity>
    </View>
  );
};

const Bottom = ({themeStyle}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={() => {}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: themeStyle.primaryText,
          }}>
          Terms of service
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontWeight: '300',
          color: themeStyle.primaryText,
        }}>
        Version 1.0.0
      </Text>
    </View>
  );
};

export default function CustomDrawerContent(props) {
  const themeStyle = useSelector(state => state.app.themeStyle);
  return (
    <SafeAreaMarginIncludedScreenWrapper
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <User navigation={props} themeStyle={themeStyle} />
      <Divider />
      <Menus props={props} themeStyle={themeStyle} />
      <Divider />
      <Bottom themeStyle={themeStyle} />
    </SafeAreaMarginIncludedScreenWrapper>
  );
}
