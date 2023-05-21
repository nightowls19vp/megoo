import {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../constants/color.const';
import {getUserGroup} from './services/group.service';
import styles from './styles/style';

const GroupScreen = () => {
  const getGroups = async () => {
    const groups = await getUserGroup();
    console.log('Groups:', groups.groups);
  };

  useEffect(() => {
    getGroups();
  }, []);

  const renderGroupItem = () => {
    return (
      <View style={styles.groupRow}>
        <Image
          source={{
            uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
          }}
          style={styles.avatar}
        />
        <View style={styles.groupInfo}>
          <Text>Tên gói</Text>
          <Text>Ngày mua</Text>
          <Text>Trạng thái</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách nhóm</Text>

        <TouchableOpacity>
          <Text
            onPress={() => {
              console.log('Xem tất cả');
            }}
            style={styles.subTitle}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>
      {renderGroupItem()}
    </View>
  );
};

export default GroupScreen;
