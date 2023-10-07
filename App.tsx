// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

export default App;
