/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {observer} from 'mobx-react';
import React, {createContext, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';

import notifee from '@notifee/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {checkLogin} from './src/common/auth';
import DrawerNavigation from './src/common/components/DrawerNavigation';
import appStore from './src/common/store/app.store';
import RoutesName from './src/constants/route-names.const';
import LoginScreen from './src/screens/login/screens/LoginScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  const checkLoggedIn = async () => {
    if (appStore.isLoggedIn === false) {
      const response = await checkLogin();
      if (response == true) {
        appStore.setIsLoggedIn(true);
      }
    }
    // await AsyncStorage.setItem(
    //   'accessToken',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoidXNlcjAiLCJ1c2VybmFtZSI6InVzZXIwIiwiZW1haWwiOiJ1c2VyMEBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInVzZXJJbmZvSWQiOiI2NDk2NTFlNmQ0OTFlZmMxNWJiMmEyMDQiLCJzb2NpYWxBY2NvdW50cyI6W119LCJpYXQiOjE2ODc2Nzk0NDQsImV4cCI6MTY4Nzc2NTg0NH0.JCJfehOag5CrR1EXGSPN-tltc2pr0Ec26mLnMRRQqR8',
    // );
    // appStore.setIsLoggedIn(true);
  };

  useEffect(() => {
    checkLoggedIn();

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [appStore.isLoggedIn]);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        // <ActivityIndicator size="large" color="orange" />
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <>
              {appStore.isLoggedIn ? (
                <Stack.Group screenOptions={{headerShown: false}}>
                  <Stack.Screen
                    name={RoutesName.HOME_DRAWER}
                    component={DrawerNavigation}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen
                    options={{headerShown: false}}
                    name={RoutesName.HOME_DRAWER}
                    component={DrawerNavigation}
                  />
                  <Stack.Screen
                    name={RoutesName.LOGIN}
                    component={LoginScreen}
                  />
                  <Stack.Screen
                    name={RoutesName.REGISTER}
                    component={RegisterScreen}
                  />
                </Stack.Group>
              )}
            </>
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};

export default observer(App);
