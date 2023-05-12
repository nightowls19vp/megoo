import Icon from 'react-native-vector-icons/AntDesign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, Pressable} from 'react-native';

import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';

import ProfileScreen from '../../../screens/profile/screens/ProfileScreen';
import EditProfileScreen from '../../../screens/profile/screens/EditProfileScreen';
import SettingsScreen from '../../../screens/settings/screens/SettingsScreen';
import AppInfoScreen from './../../../screens/settings/screens/AppInfoScreen';
import PoliciesScreen from './../../../screens/settings/screens/PoliciesScreen';
import ChangeAvatarScreen from '../../../screens/profile/screens/ChangeAvatarScreen';
import PackageScreen from '../../../screens/package/screens/PackageScreen';

function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
}

function StorageScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Storage!</Text>
    </View>
  );
}

const PackageStack = createNativeStackNavigator();

function PackageScreenStack() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={RouteNames.PACKAGE}
        component={PackageScreen}
      />
    </ProfileStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileScreenStack() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={RouteNames.PROFILE}
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name={RouteNames.EDIT_PROFILE}
        component={EditProfileScreen}
      />
    </ProfileStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsScreenStack() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name={RouteNames.SETTINGS}
        component={SettingsScreen}
      />
      <SettingsStack.Screen
        name={RouteNames.APP_INFO}
        component={AppInfoScreen}
      />
      <SettingsStack.Screen
        name={RouteNames.POLICIES_RIGHTS}
        component={PoliciesScreen}
      />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomNavigationBar() {
  return (
    <Tab.Navigator
      initialRouteName={RouteNames.HOME_TAB}
      screenOptions={{
        // headerLeft: (props) => (
        //   <Pressable style={{ paddingLeft: 15 }}>
        //     <Icon name="bars" size={22} color={Colors.primary} />
        //   </Pressable>
        // ),
        // headerRight: (props) => (
        //   <Pressable style={{ paddingRight: 15 }}>
        //     <Icon name="search1" size={22} color={Colors.primary} />
        //   </Pressable>
        // ),
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {paddingBottom: 6},
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          height: 50,
          paddingBottom: 0,
        },
      }}>
      <Tab.Screen
        name={RouteNames.PACKAGE}
        component={PackageScreenStack}
        options={{
          title: 'Quản lý gói',
          tabBarActiveTintColor: Colors.primary,
          tabBarIcon: ({color}) => {
            return <Icon name="addusergroup" size={22} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.STORAGE}
        component={StorageScreen}
        options={{
          tabBarActiveTintColor: Colors.primary,
          tabBarIcon: ({color}) => {
            return <Icon name="isv" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.HOME_TAB}
        component={HomeScreen}
        options={{
          tabBarActiveTintColor: Colors.primary,
          tabBarIcon: ({color}) => {
            return <Icon name="home" size={20} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name={RouteNames.PROFILE_STACK}
        component={ProfileScreenStack}
        initialParams={{screen: RouteNames.PROFILE}}
        options={{
          title: 'Trang cá nhân',
          tabBarIcon: ({color}) => {
            return <Icon name="user" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.SETTINGS_STACK}
        component={SettingsScreenStack}
        initialParams={{screen: RouteNames.SETTINGS}}
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({color}) => {
            return <Icon name="setting" size={20} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
