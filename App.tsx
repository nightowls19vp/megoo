/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './src/common/components/DrawerNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import RoutesName from './src/constants/route-names.const';
import LoginScreen from './src/screens/login/screens/LoginScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View} from 'react-native';
import {URL_HOST} from './src/core/config/api/api.config';
import axios from 'axios';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log(accessToken);

    if (accessToken !== null) {
      setIsLoggedIn(true);
      // const validateEndpoint = 'api/auth/validate';
      // const reqUrl = `${URL_HOST}${validateEndpoint}`;
      // console.log(reqUrl);
      // const res = await axios.get(reqUrl, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // console.log(res.data);
      // return res.data;
    }
    const refreshToken = await AsyncStorage.getItem('refreshToken');
  };

  useEffect(() => {
    // checkLogin();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <>
              {isLoggedIn ? (
                <Stack.Screen
                  name={RoutesName.HOME_DRAWER}
                  component={DrawerNavigation}
                />
              ) : (
                <>
                  <Stack.Screen
                    name={RoutesName.LOGIN}
                    component={LoginScreen}
                  />
                  <Stack.Screen
                    name={RoutesName.REGISTER}
                    component={RegisterScreen}
                  />
                  <Stack.Screen
                    name={RoutesName.HOME_DRAWER}
                    component={DrawerNavigation}
                  />
                </>
              )}
            </>
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};

export default App;
