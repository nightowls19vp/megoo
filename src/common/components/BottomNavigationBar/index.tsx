import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';
import appStore from './../../store/app.store';

import ProfileScreen from '../../../screens/profile/screens/ProfileScreen';
import SettingsScreen from '../../../screens/settings/screens/SettingsScreen';
import AppInfoScreen from './../../../screens/settings/screens/AppInfoScreen';
import PoliciesScreen from './../../../screens/settings/screens/PoliciesScreen';

import PackageScreen from '../../../screens/package/screens/PackageScreen';
import CartScreen from '../../../screens/package/screens/CartScreen';
import PaymentScreen from '../../../screens/package/screens/PaymentScreen';

import UserInfoScreen from '../../../screens/profile/screens/UserInfoScreen';
import EditProfileScreen from '../../../screens/profile/screens/EditProfileScreen';
import GroupInfoScreen from '../../../screens/profile/screens/GroupInfoScren';
import GroupsScreen from '../../../screens/profile/screens/GroupsScreen';
import CurrentPackage from '../../../screens/profile/screens/CurrentPackageScreen';
import OtherPackages from '../../../screens/profile/screens/OtherPackages';

import UserGroupsScreen from '../../../screens/storage/screens/GroupsScreen';
import StorageLocationScreen from '../../../screens/storage/screens/StorageLocationScreen';
import ProductsScreen from '../../../screens/storage/screens/ProductsScreen';
import ProductDetailScreen from '../../../screens/storage/screens/ProductDetailScreen';
import AddProdInfoScreen from '../../../screens/storage/screens/AddProdInfoScreen';
import ScanBarcodeScreen from '../../../screens/storage/screens/ScanBarcodeScreen';
import ChatScreen from '../../../screens/chat/screens/ChatScreen';
import GroupChatsScreen from '../../../screens/chat/screens/GroupChatsScreen';

function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
}

const ChatStack = createNativeStackNavigator();
const ChatScreenStack = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteNames.GROUP_CHATS}
      screenOptions={{headerShown: false}}>
      <ChatStack.Screen
        name={RouteNames.CHAT}
        component={ChatScreen}
        options={{}}
      />
      <ChatStack.Screen
        name={RouteNames.GROUP_CHATS}
        component={GroupChatsScreen}
      />
    </ChatStack.Navigator>
  );
};

const PackageStack = createNativeStackNavigator();

const PackageScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <PackageStack.Navigator initialRouteName={RouteNames.PACKAGE}>
      <PackageStack.Screen
        name={RouteNames.PACKAGE}
        component={PackageScreen}
        options={{
          headerRight: ({tintColor}) => {
            return appStore.isLoggedIn ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('Cart');
                  navigation.navigate(RouteNames.CART as never, {} as never);
                }}>
                {/* <Icon name="shoppingcart" size={22} color={tintColor} /> */}
                <Ionicons name="cart-outline" size={24} color={tintColor} />
              </TouchableOpacity>
            ) : null;
          },
        }}
      />
      <PackageStack.Screen name={RouteNames.CART} component={CartScreen} />
      <PackageStack.Screen
        name={RouteNames.PAYMENT}
        component={PaymentScreen}
      />
      <PackageStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
    </PackageStack.Navigator>
  );
};

const StorageStack = createNativeStackNavigator();

const StorageScreenStack = () => {
  return (
    <StorageStack.Navigator initialRouteName={RouteNames.STORAGE_GROUPS}>
      <StorageStack.Screen
        name={RouteNames.STORAGE}
        component={StorageLocationScreen}
      />
      <StorageStack.Screen
        name={RouteNames.STORAGE_GROUPS}
        component={UserGroupsScreen}
      />
      <StorageStack.Screen
        name={RouteNames.PRODUCTS}
        component={ProductsScreen}
      />
      <StorageStack.Screen
        name={RouteNames.PRODUCT_DETAIL}
        component={ProductDetailScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_PRODUCT_INFO}
        component={AddProdInfoScreen}
      />
      <StorageStack.Screen
        name={RouteNames.SCAN_BARCODE}
        component={ScanBarcodeScreen}
      />
      <StorageStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
    </StorageStack.Navigator>
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
      <ProfileStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
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
      <SettingsStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomNavigationBar() {
  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName={RouteNames.HOME_TAB}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {paddingBottom: 5},
        tabBarActiveTintColor: Colors.bottomTabActiveIcon,
        tabBarInactiveTintColor: Colors.bottomTabInactiveIcon,
        tabBarStyle: {
          // height: 60,
          // paddingBottom: 0,
          backgroundColor: Colors.bottomTabBackground,
        },
      }}>
      <Tab.Screen
        name={RouteNames.PACKAGE_STACK}
        component={PackageScreenStack}
        initialParams={{screen: RouteNames.PACKAGE}}
        options={{
          unmountOnBlur: true,
          title: 'Gói',
          tabBarIcon: ({color}) => {
            return <Icon name="addusergroup" size={22} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.STORAGE_STACK}
        component={StorageScreenStack}
        initialParams={{screen: RouteNames.STORAGE_GROUPS}}
        options={{
          unmountOnBlur: true,
          title: 'Kho',
          tabBarIcon: ({color}) => {
            return <Icon name="isv" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.HOME_TAB}
        component={HomeScreen}
        options={{
          unmountOnBlur: true,
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
          unmountOnBlur: true,
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
          unmountOnBlur: true,
          title: 'Cài đặt',
          tabBarIcon: ({color}) => {
            return <Icon name="setting" size={20} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
