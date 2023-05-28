import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RouteNames from '../../../constants/route-names.const';
import BottomNavigationBar from '../BottomNavigationBar';
import {Text, View, Image, TouchableOpacity} from 'react-native';
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
        <Text
          style={{
            textAlign: 'center',
            color: Colors.primary,
            fontSize: 18,
            fontWeight: 'bold',
          }}
          numberOfLines={2}>
          {userStore.name}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

const ChatScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text>Chat screen</Text>
    </View>
  );
};

export default function DrawerNavigation({navigation}: {navigation: any}) {
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.HOME_TAB}
      drawerContent={props => <CustomDrawerContent {...props} />}
      // backBehavior="initialRoute"
      screenOptions={{
        drawerLabelStyle: {marginLeft: -15},
        drawerActiveTintColor: Colors.primary,

        headerRight: () => {
          return (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 15,
                marginRight: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Search');
                  // navigation.navigate(RouteNames.CHAT as never, {} as never);
                  // navigation.goBack();
                }}>
                <Ionicons name="search-outline" size={24} color={'black'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('Chat');
                  navigation.navigate(RouteNames.CHAT as never, {} as never);
                  // navigation.goBack();
                }}>
                <Ionicons
                  // name="chatbubble-ellipses-outline"
                  name="md-chatbubble-ellipses-outline"
                  size={24}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
          );
        },
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
