import {useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getFundList} from './services/fund-list.service';
import groupStore from './../../../../../common/store/group.store';
import {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FundListScreen = () => {
  const navigation = useNavigation();

  const [funds, setFunds] = useState<
    {
      _id: string;
      createdAt: string;
      description: string;
      ends: string;
      history: any[];
      members: {
        _id: string;
        email: string;
        name: string;
        avatar: string;
      }[];
      startDate: string;
      summary: string;
      times: number;
      total: number;
      updatedAt: string;
    }[]
  >([]);

  const getFunds = async () => {
    try {
      const response = await getFundList(groupStore.id);
      console.log('Fund list', response.group.funding);

      if (
        !response?.group ||
        !response?.group?.funding ||
        response?.group?.funding?.length === 0
      ) {
        setFunds([]);
      } else {
        setFunds(
          response?.group?.funding?.map((fund: any) => ({
            _id: fund._id,
            createdAt: fund.createdAt,
            description: fund.description,
            ends: fund.ends,
            history: fund.history,
            members: fund.members.map((member: any) => ({
              _id: member._id,
              email: member.email,
              name: member.name,
              avatar: member.avatar,
            })),
            startDate: fund.startDate,
            summary: fund.summary,
            times: fund.times,
            total: fund.total,
            updatedAt: fund.updatedAt,
          })),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFunds();
  }, []);

  const renderFundItem = () => {
    return funds.map((fund: any) => {
      return (
        <TouchableOpacity key={fund._id} style={styles.fundsContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Tiêu đề:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {fund.summary}{' '}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Mô tả:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {fund.description}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Kỳ hạn:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {fund.times} tháng
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách phân chia chi tiêu</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.CREATE_FUND as never, {} as never);
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>
      {funds.length > 0 ? renderFundItem() : <Text>Không có quỹ nào</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  fundsContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    //   justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    padding: 10,
    gap: 10,
    borderRadius: 10,
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    color: Colors.text.grey,
    fontSize: 14,
  },
});

export default FundListScreen;
