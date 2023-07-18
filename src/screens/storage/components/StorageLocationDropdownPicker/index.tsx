import {observer} from 'mobx-react';
import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import * as sl from '../../services/storage-location.service';

interface IProps {
  groupId: string;
  zIndex: number;
  zIndexInverse: number;
  navigation: any;
}
const StorageLocationDropdownPicker: React.FC<IProps> = ({
  groupId,
  zIndex,
  zIndexInverse,
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Show the loading animation
    setLoading(true);

    // Get items from API
    const resp = await sl.getStorageLocationPaginated({
      groupId: '1',
      searchBy: ['name'],
      search: text,
      limit: 100,
      filter: {
        'timestamp.deletedAt': '$eq:$null',
      },
      sortBy: ['name:ASC', 'timestamp.createdAt:ASC'],
    });

    // Set items for the dropdown
    const items = resp.data
      .map(item => ({
        label: item.name || '',
        value: item.id || '',
      }))
      .filter(item => item.label !== '');

    setItems(items);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'flex-end',
        backgroundColor: Colors.background.white,
        borderRadius: 10,
        // marginVertical: 10,
        zIndex: zIndex,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 10,
        }}>
        <Text
          style={{
            width: '90%',
            textAlign: 'left',
            color: Colors.title.orange,
            fontWeight: 'bold',
            fontSize: 14,
            marginBottom: 5,
          }}>
          Vị trí lưu trữ
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(RouteNames.ADD_STORAGE_LOCATION, {})
          }>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.text.orange}
          />
        </TouchableOpacity>
      </View>

      <DropDownPicker
        listMode="MODAL"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        placeholder="Chọn vị trí lưu trữ"
        placeholderStyle={{
          color: Colors.text.lightgrey,
        }}
        loading={loading}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        dropDownContainerStyle={{
          borderColor: Colors.border.lightgrey,
        }}
        style={{
          borderColor: Colors.border.lightgrey,
        }}
        searchable={true}
        searchPlaceholder="Tìm kiếm ..."
        disableLocalSearch={true} // required for remote search
        onChangeSearchText={text => search(text)} // required for remote search
        autoScroll={true}
      />
    </View>
  );
};

export default observer(StorageLocationDropdownPicker);
