import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';

import ProfileScreen from '../../../screens/profile/screens/ProfileScreen';
import SettingsScreen from '../../../screens/settings/screens/SettingsScreen';
import AppInfoScreen from './../../../screens/settings/screens/AppInfoScreen';
import PoliciesScreen from './../../../screens/settings/screens/PoliciesScreen';
import PackageScreen from '../../../screens/package/screens/PackageScreen';
import CartScreen from '../../../screens/package/screens/CartScreen';
import UserInfoScreen from '../../../screens/profile/screens/UserInfoScreen';
import EditProfileScreen from '../../../screens/profile/screens/EditProfileScreen';
import GroupInfoScreen from '../../../screens/profile/screens/GroupInfoScren';
import GroupsScreen from '../../../screens/profile/screens/GroupsScreen';
import PaymentScreen from '../../../screens/package/screens/PaymentScreen';
import CurrentPackage from '../../../screens/profile/screens/CurrentPackageScreen';

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

const ChatScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text>Chat screen</Text>
    </View>
  );
};

const PackageScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <PackageStack.Navigator initialRouteName={RouteNames.PACKAGE}>
      <PackageStack.Screen
        name={RouteNames.PACKAGE}
        component={PackageScreen}
        options={{
          headerRight: ({tintColor}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log('Cart');
                  navigation.navigate(RouteNames.CART as never, {} as never);
                }}>
                <Icon name="shoppingcart" size={22} color={tintColor} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <PackageStack.Screen
        name={RouteNames.CHAT}
        component={ChatScreen}
        // options={{
        //   headerLeft: () => {
        //     return (
        //       <Pressable
        //         style={{marginRight: 30}}
        //         onPress={() => {
        //           console.log('Chat');
        //           navigation.navigate(RouteNames.PACKAGE as never, {} as never);
        //         }}>
        //         <FeatherIcon name="chevron-left" size={24} color={'orange'} />
        //       </Pressable>
        //     );
        //   },
        // }}
      />
      <PackageStack.Screen
        name={RouteNames.CURRENT_PACKAGE}
        component={CurrentPackage}
      />
      <PackageStack.Screen name={RouteNames.CART} component={CartScreen} />
      <PackageStack.Screen
        name={RouteNames.PAYMENT}
        component={PaymentScreen}
      />
    </PackageStack.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator();

function ProfileScreenStack() {
  return (
    <ProfileStack.Navigator initialRouteName={RouteNames.PROFILE}>
      <ProfileStack.Screen
        name={RouteNames.PROFILE}
        component={UserInfoScreen}
      />
      <ProfileStack.Screen
        name={RouteNames.EDIT_PROFILE}
        component={EditProfileScreen}
      />
      <ProfileStack.Screen
        name={RouteNames.GROUP_INFO}
        component={GroupInfoScreen}
      />
      <ProfileStack.Screen
        name={RouteNames.CURRENT_PACKAGE}
        component={CurrentPackage}
      />
      <ProfileStack.Screen name={RouteNames.CHAT} component={ChatScreen} />
    </ProfileStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsScreenStack() {
  return (
    <SettingsStack.Navigator initialRouteName={RouteNames.SETTINGS}>
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
      <SettingsStack.Screen name={RouteNames.CHAT} component={ChatScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomNavigationBar() {
  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName={RouteNames.HOME_TAB}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {paddingBottom: 5},
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
        },
      }}>
      <Tab.Screen
        name={RouteNames.PACKAGE}
        component={PackageScreenStack}
        initialParams={{screen: RouteNames.PACKAGE}}
        options={{
          title: 'Gói',
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
          title: 'Kho',
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
          title: 'Tôi',
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
