import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Touchable, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import {Colors} from '../../../../constants/color.const';
import {IItem} from '../../interfaces/base-dto/item.interface';
import * as gp from '../../services/group-products.service';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface IProps {
  navigation: any;
  groupId: string;
  zIndex: number;
  zIndexInverse: number;
  fnUpdateGpImage: Function;
}
import RouteNames from '../../../../constants/route-names.const';
const GroupProductDropdownPicker: React.FC<IProps> = ({
  navigation,
  groupId,
  zIndex,
  zIndexInverse,
  fnUpdateGpImage,
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

  const [itemsFullData, setItemsFullData] = useState<IItem[]>([]);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Show the loading animation
    setLoading(true);

    // Get items from API
    const resp = await gp.getGroupProductPaginated({
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
    setItemsFullData(resp.data);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        backgroundColor: Colors.background.white,
        borderRadius: 10,
        marginVertical: 10,
        gap: 10,
        zIndex: zIndex,
      }}>
      <TouchableOpacity
        onPress={() => {
          //todo: navigate to the add group product screen
          console.log('navigate to the add group product screen');
        }}>
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={Colors.text.orange}
        />
      </TouchableOpacity>
      <DropDownPicker
        listMode="MODAL"
        placeholder="Chọn nhu yếu phẩm"
        scrollViewProps={{
          nestedScrollEnabled: true,
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
        searchable={true}
        searchPlaceholder="Tìm kiếm ..."
        disableLocalSearch={true} // required for remote search
        onChangeSearchText={text => search(text)} // required for remote search
        autoScroll={true}
        onSelectItem={item => {
          console.log('gp selected: ', JSON.stringify(item, null, 2));

          console.log(
            'new image: ',
            JSON.stringify(
              itemsFullData.find(i => i.id === item.value),
              null,
              2,
            ),
          );

          fnUpdateGpImage(
            itemsFullData.find(i => i.id === item.value)?.image ||
              IMAGE_URI_DEFAULT,
          );
        }}
      />
    </View>
  );
};

export default observer(GroupProductDropdownPicker);
