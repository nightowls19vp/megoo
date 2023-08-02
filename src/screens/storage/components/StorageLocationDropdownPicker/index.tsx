import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import * as sl from '../../services/storage-location.service';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../screens/AddGroupProductScreen/styles/style';

import {Dropdown} from 'react-native-element-dropdown';

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
  const [isFocus, setIsFocus] = useState(false);

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

      <Dropdown
        placeholderStyle={{
          color: Colors.text.lightgrey,
        }}
        data={items}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? '"Chọn vị trí lưu trữ"' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value as any);
          setIsFocus(false);
        }}
      />

      {/* <DropDownPicker
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
        containerStyle={{
          width: '100%',
          zIndex: 1000,
          padding: 0,
          marginBottom: 5,
        }}
        dropDownContainerStyle={{
          borderColor: Colors.border.lightgrey,
          borderRadius: 0,
        }}
        style={{
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 0,
          paddingLeft: 0,
          paddingRight: 0,
          minHeight: 40,
          borderColor: Colors.border.lightgrey,
        }}
        searchable={true}
        searchPlaceholder="Tìm kiếm ..."
        disableLocalSearch={true} // required for remote search
        onChangeSearchText={text => search(text)} // required for remote search
        autoScroll={true}
      /> */}
    </View>
  );
};

export default observer(StorageLocationDropdownPicker);
