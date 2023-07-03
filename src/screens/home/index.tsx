import {Dimensions} from 'react-native';
import {Text, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import RouteNames from '../../constants/route-names.const';
import {Colors} from '../../constants/color.const';

const width = Dimensions.get('window').width;

const HomeScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.utilitiesContainer}>
        <Text style={styles.title}>Tiện ích</Text>
        <View style={styles.utilitiesContent}>
          <TouchableOpacity
            style={styles.utility}
            onPress={() => navigation.navigate(RouteNames.BILL_LIST_STACK, {})}>
            <Text style={styles.utilityText}>Quản lý chi tiêu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utility}>
            <Text style={styles.utilityText}>Việc cần làm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'pink',
  },
  text: {
    fontSize: 16,
    color: Colors.text.grey,
  },
  title: {
    width: '100%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  utilitiesContainer: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
    marginBottom: 20,
  },
  utilitiesContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    // marginBottom: 10,
    flexWrap: 'wrap',
  },
  utility: {
    minWidth: '45%',
    padding: 20,
    display: 'flex',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    borderColor: Colors.border.orange,
    borderWidth: 1,
  },
  utilityText: {
    fontSize: 16,
    color: Colors.text.orange,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default HomeScreen;
