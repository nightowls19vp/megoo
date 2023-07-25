import {View, Text, TouchableOpacity, Button} from 'react-native';
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
import EditGroupInfoScreen from '../../../screens/profile/screens/EditGroupInfoScreen';

import GroupsProductsListScreen from '../../../screens/storage/screens/GroupsScreen';
import StorageLocationScreen from '../../../screens/storage/screens/StorageLocationScreen';
import AddStorageLocationScreen from '../../../screens/storage/screens/AddStorageLocationScreen';
import AddPurchaseLocationScreen from '../../../screens/storage/screens/AddPurchaseLocationScreen';
import AddGroupProductScreen from '../../../screens/storage/screens/AddGroupProductScreen';
import ProductsScreen from '../../../screens/storage/screens/ProductsScreen';
import ProductDetailScreen from '../../../screens/storage/screens/ProductDetailScreen';
import AddProdInfoScreen from '../../../screens/storage/screens/AddProdInfoScreen';
import ScanBarcodeScreen from '../../../screens/storage/screens/ScanBarcodeScreen';

import ChatScreen from '../../../screens/chat/screens/ChatScreen';
import GroupChatListScreen from '../../../screens/chat/screens/GroupChatListScreen';

import HomeScreen from '../../../screens/home';

import GroupBillListScreen from '../../../screens/home/screens/bill/GroupBillListScreen';
import BillListScreen from '../../../screens/home/screens/bill/BillListScreen';
import BillScreen from '../../../screens/home/screens/bill/BillScreen';
import BillInfoScreen from '../../../screens/home/screens/bill/BillInfoScreen';

import GroupTodosListScreen from '../../../screens/home/screens/todos/GroupTodosListScreen';
import TodosListScreen from '../../../screens/home/screens/todos/TodosListScreen';
import TodosScreen from '../../../screens/home/screens/todos/TodosScreen';
import TodosTabScreen from '../../../screens/home/screens/todos/TodosTabScreen';
import CreateTodosScreen from '../../../screens/home/screens/todos/CreateTodosScreen';

import GroupTaskListScreen from '../../../screens/home/screens/task/GroupTaskListScreen';
import TaskListScreen from '../../../screens/home/screens/task/TaskListScreen';
import CreateTaskScreen from '../../../screens/home/screens/task/CreateTaskScreen';

const ChatStack = createNativeStackNavigator();
const ChatScreenStack = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteNames.GROUP_CHATS}
      screenOptions={{headerShown: false}}>
      <ChatStack.Screen name={RouteNames.CHAT} component={ChatScreen} />
      <ChatStack.Screen
        name={RouteNames.GROUP_CHATS}
        component={GroupChatListScreen}
      />
    </ChatStack.Navigator>
  );
};

const BillStack = createNativeStackNavigator();
const BillScreenStack = () => {
  return (
    <BillStack.Navigator initialRouteName={RouteNames.BILL}>
      <BillStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      <BillStack.Screen
        name={RouteNames.BILL}
        component={BillScreen}
        options={{headerShown: true}}
      />
    </BillStack.Navigator>
  );
};

const BillListStack = createNativeStackNavigator();
const BillListScreenStack = () => {
  return (
    <BillListStack.Navigator initialRouteName={RouteNames.GROUP_BILL_LIST}>
      <BillListStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      <BillListStack.Screen
        name={RouteNames.BILL_MANAGEMENT}
        component={BillListScreen}
        options={{headerShown: true}}
      />
      <BillStack.Screen
        name={RouteNames.BILL}
        component={BillScreen}
        options={{headerShown: true}}
      />
      <BillStack.Screen
        name={RouteNames.BILL_INFO}
        component={BillInfoScreen}
        options={{
          headerShown: true,
          // headerRight: () => {
          //   return (
          //     <TouchableOpacity>
          //       <Text
          //         style={{
          //           color: Colors.text.orange,
          //           fontWeight: 'bold',
          //           fontSize: 18,
          //         }}>
          //         Lưu
          //       </Text>
          //     </TouchableOpacity>
          //   );
          // },
        }}
      />
      <BillListStack.Screen
        name={RouteNames.GROUP_BILL_LIST}
        component={GroupBillListScreen}
        // options={{headerShown: false}}
      />
    </BillListStack.Navigator>
  );
};

const TodosListStack = createNativeStackNavigator();
const TodosListScreenStack = () => {
  return (
    <TodosListStack.Navigator initialRouteName={RouteNames.GROUP_TODOS_LIST}>
      <TodosListStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      {/* <TodosListStack.Screen
        name={RouteNames.TODOS_LIST}
        component={TodosListScreen}
        // options={{headerShown: false}}
      /> */}
      <TodosListStack.Screen
        name={RouteNames.CREATE_TODOS}
        component={CreateTodosScreen}
        // options={{headerShown: false}}
      />
      <TodosListStack.Screen
        name={RouteNames.GROUP_TODOS_LIST}
        component={GroupTodosListScreen}
        // options={{headerShown: false}}
      />
      <TodosListStack.Screen
        name={RouteNames.TODOS_TAB}
        component={TodosTabScreen}
        // options={{headerShown: false}}
      />
      <TodosListStack.Screen
        name={RouteNames.TODOS}
        component={TodosScreen}
        // options={{headerShown: false}}
      />
    </TodosListStack.Navigator>
  );
};

const TaskListStack = createNativeStackNavigator();
const TaskListScreenStack = () => {
  return (
    <TaskListStack.Navigator initialRouteName={RouteNames.GROUP_TASK_LIST}>
      <TaskListStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      <TaskListStack.Screen
        name={RouteNames.GROUP_TASK_LIST}
        component={GroupTaskListScreen}
        // options={{headerShown: false}}
      />
      <TaskListStack.Screen
        name={RouteNames.TASK_LIST}
        component={TaskListScreen}
        // options={{headerShown: false}}
      />
      <TaskListStack.Screen
        name={RouteNames.CREATE_TASK}
        component={CreateTaskScreen}
        // options={{headerShown: false}}
      />
    </TaskListStack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator initialRouteName={RouteNames.HOME}>
      <HomeStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      <HomeStack.Screen name={RouteNames.HOME} component={HomeScreen} />
      <HomeStack.Screen
        name={RouteNames.BILL_LIST_STACK}
        component={BillListScreenStack}
        options={{
          title: 'Quản lý chi tiêu',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.TODOS_LIST_STACK}
        component={TodosListScreenStack}
        options={{
          title: 'Quản lý việc cần làm',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.TASK_LIST_STACK}
        component={TaskListScreenStack}
        options={{
          title: 'Quản lý thời gian',
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
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

const AddProductStack = createNativeStackNavigator();
const AddProductScreenStack = () => {
  return (
    <AddProductStack.Navigator initialRouteName={RouteNames.STORAGE_GROUPS}>
      <AddProductStack.Screen
        name={appStore.isLoggedIn ? RouteNames.STORAGE_GROUPS : 'Quản lý gói'}
        component={GroupsProductsListScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.ADD_GROUP_PRODUCT}
        component={AddProdInfoScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.ADD_STORAGE_LOCATION}
        component={AddStorageLocationScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.ADD_PURCHASE_LOCATION}
        component={AddPurchaseLocationScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
    </AddProductStack.Navigator>
  );
};

const StorageStack = createNativeStackNavigator();
const StorageScreenStack = () => {
  return (
    <StorageStack.Navigator initialRouteName={RouteNames.STORAGE_GROUPS}>
      <StorageStack.Screen
        name={appStore.isLoggedIn ? RouteNames.STORAGE_GROUPS : 'Quản lý gói'}
        component={GroupsProductsListScreen}
      />
      <StorageStack.Screen
        name={RouteNames.STORAGE}
        component={StorageLocationScreen}
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
        name={RouteNames.ADD_GROUP_PRODUCT}
        component={AddGroupProductScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_STORAGE_LOCATION}
        component={AddStorageLocationScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_PURCHASE_LOCATION}
        component={AddPurchaseLocationScreen}
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
        name={RouteNames.EDIT_GROUP_INFO}
        component={EditGroupInfoScreen}
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
      initialRouteName={RouteNames.HOME_STACK_BOTTOM}
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
        name={RouteNames.PACKAGE_STACK_BOTTOM}
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
        name={RouteNames.STORAGE_STACK_BOTTOM}
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
        name={RouteNames.HOME_STACK_BOTTOM}
        component={HomeScreenStack}
        initialParams={{screen: RouteNames.HOME}}
        options={{
          unmountOnBlur: true,
          title: 'Trang chủ',
          tabBarIcon: ({color}) => {
            return <Icon name="home" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.PROFILE_STACK}
        component={ProfileScreenStack}
        initialParams={{screen: RouteNames.PROFILE}}
        // listeners={({navigation}) => ({
        //   tabPress: () => {
        //     if (appStore.isLoggedIn === false) {
        //       console.log(appStore.isLoggedIn);

        //       navigation.navigate(RouteNames.LOGIN);
        //     }
        //   },
        // })}
        options={{
          unmountOnBlur: true,
          title: 'Tôi',
          tabBarIcon: ({color}) => {
            return <Icon name="user" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.SETTINGS_STACK_BOTTOM}
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
