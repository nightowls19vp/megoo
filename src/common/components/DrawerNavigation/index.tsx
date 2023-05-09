import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import RouteNames from '../../../constants/route-names.const';
import BottomNavigationBar from '../BottomNavigationBar';
import {Text, View, Image} from 'react-native';
import userStore from '../../store/user.store';
import {Colors} from '../../../constants/color.const';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingTop: 0,
      }}>
      <View
        style={{
          // backgroundColor: Colors.primary,
          height: '30%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: userStore.avatar,
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 150 / 2,
            marginBottom: 20,
          }}
        />
        <Text style={{color: Colors.primary, fontSize: 20, fontWeight: 'bold'}}>
          {userStore.name}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.HOME_TAB}
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerLabelStyle: {marginLeft: -15},
        drawerActiveTintColor: Colors.primary,
      }}>
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Trang chủ',
          drawerIcon: ({color}) => <Icon name="home" size={20} color={color} />,
        }}
        name={RouteNames.HOME_TAB}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.HOME_TAB}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Quản lý gói',
          drawerIcon: ({color}) => (
            <Icon name="addusergroup" size={20} color={color} />
          ),
        }}
        name={RouteNames.PACKAGE}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PACKAGE}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Quản lý kho',
          drawerIcon: ({color}) => <Icon name="isv" size={20} color={color} />,
        }}
        name={RouteNames.STORAGE}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.STORAGE}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Trang cá nhân',
          drawerIcon: ({color}) => <Icon name="user" size={20} color={color} />,
        }}
        name={RouteNames.PROFILE_STACK}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PROFILE_STACK}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Đoạn chat',
          drawerIcon: ({color}) => (
            <Icon name="message1" size={20} color={color} />
          ),
        }}
        name={RouteNames.CHAT}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.CHAT}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Cài đặt',
          drawerIcon: ({color}) => (
            <Icon name="setting" size={20} color={color} />
          ),
        }}
        name={RouteNames.SETTINGS_STACK}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.SETTINGS_STACK}}
      />
    </Drawer.Navigator>
  );
}
