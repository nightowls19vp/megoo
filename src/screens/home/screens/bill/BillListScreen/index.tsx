import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RouteNames from '../../../../../constants/route-names.const';
import {Colors} from '../../../../../constants/color.const';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect} from 'react';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillListScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params.groupId;

  useEffect(() => {
    console.log('groupId', groupId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách phân chia chi tiêu</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.BILL, {
              groupId: groupId,
            });
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: width,
    minHeight: height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: 'pink',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
});

export default BillListScreen;
