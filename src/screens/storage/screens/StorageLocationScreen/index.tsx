import {Image, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import styles from './styles/style';

const StorageLocationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nơi lưu trữ</Text>
      <ScrollView contentContainerStyle={styles.locationContainer}>
        <TouchableOpacity style={styles.locationItem}>
          <Image
            source={{
              uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
            }}
            style={styles.locationImg}
          />
          <View style={styles.locationInfoContainer}>
            <View style={styles.locationInfoRow}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                Nơi lưu trữ:
              </Text>
              <Text style={styles.text}>Tủ bếp</Text>
            </View>
            <View style={[styles.locationInfoRow, {width: '70%'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                Ghi chú:
              </Text>
              <Text style={styles.text} numberOfLines={3}>
                Lầu 1, bên trái, tủ thứ 3, ngăn số 2, góc trong cùng bên phải
                Lầu 1, bên trái, tủ thứ 3, ngăn số 2, góc trong cùng bên phải
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default StorageLocationScreen;
