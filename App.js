// In App.js in a new project
import 'react-native-gesture-handler';

import * as React from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {StatusBar, useWindowDimensions} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Splash from './src/screens/splash/Splash';
import SplashOne from './src/screens/splash/SplashOne';
import SplashTwo from './src/screens/splash/SplashTwo';
import SplashThree from './src/screens/splash/SplashThree';
import navigationNames from './src/navigationNames';
import Register from './src/screens/auth/Register';
import Login from './src/screens/auth/Login';
import EmailVerification from './src/screens/auth/EmailVerification';
import ForgotPassword from './src/screens/auth/ForgotPassword';
import ResetPassword from './src/screens/auth/ResetPassword';
import {useSelector} from 'react-redux';
import Home from './src/screens/content/Home';
import Account from './src/screens/content/Account';
import Notifications from './src/screens/content/Notifications';
import Spots from './src/screens/content/Spots';
import CustomDrawerContent from './src/screens/content/CustomDrawerContent';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* SPLASH SCREENS */}
      <Stack.Screen name={navigationNames.Splash} component={Splash} />
      <Stack.Screen name={navigationNames.SplashOne} component={SplashOne} />
      <Stack.Screen name={navigationNames.SplashTwo} component={SplashTwo} />
      <Stack.Screen
        name={navigationNames.SplashThree}
        component={SplashThree}
      />
      {/* AUTH SCREENS */}
      <Stack.Screen name={navigationNames.Register} component={Register} />
      <Stack.Screen name={navigationNames.Login} component={Login} />
      <Stack.Screen
        name={navigationNames.EmailVerification}
        component={EmailVerification}
      />
      <Stack.Screen
        name={navigationNames.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen
        name={navigationNames.ResetPassword}
        component={ResetPassword}
      />
    </Stack.Navigator>
  );
};

const ContentNavigationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={navigationNames.BottomTabNavigation}
        component={BottomTabNavigation}
      />
    </Stack.Navigator>
  );
};
const StackNavigation = () => {
  const {token: userToken, emailVerified} = useSelector(
    state => state?.user?.user,
  );
  const themeStyle = useSelector(state => state.app.themeStyle);
  return (
    <>
      <StatusBar translucent barStyle={themeStyle?.barStyle} />
      {userToken && emailVerified == true ? (
        <ContentNavigationStack />
      ) : (
        <AuthNavigationStack />
      )}
    </>
  );
};

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={navigationNames.Home} component={Home} />
      <Tab.Screen name={navigationNames.Account} component={Account} />
      <Tab.Screen
        name={navigationNames.Notifications}
        component={Notifications}
      />
      <Tab.Screen name={navigationNames.Spots} component={Spots} />
    </Tab.Navigator>
  );
};

const DrawerNavigation = () => {
  const {width} = useWindowDimensions();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            width: width - 50,
          },
        }}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          options={({route}) => {
            const restrictedScreenNames = [
              'EmailVerification',
              'ForgotPassword',
              'Login',
              'Register',
            ];
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? 'SplashOne';
            if (
              routeName.startsWith('Splash') ||
              restrictedScreenNames.includes(routeName)
            )
              return {swipeEnabled: false};
          }}
          name="StackNavigation"
          component={StackNavigation}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
export default DrawerNavigation;
