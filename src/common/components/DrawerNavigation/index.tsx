import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import RouteNames from '../../../constants/route-names.const';
import BottomNavigationBar from '../BottomNavigationBar';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.HOME_TAB}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Trang chủ',
        }}
        name={RouteNames.HOME_TAB}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.HOME_TAB}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Quản lý gói',
        }}
        name={RouteNames.PACKAGE}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PACKAGE}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Quản lý kho',
        }}
        name={RouteNames.STORAGE}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.STORAGE}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Trang cá nhân',
        }}
        name={RouteNames.PROFILE}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PROFILE}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Cài đặt',
        }}
        name={RouteNames.SETTINGS}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.SETTINGS}}
      />
    </Drawer.Navigator>
  );
}
