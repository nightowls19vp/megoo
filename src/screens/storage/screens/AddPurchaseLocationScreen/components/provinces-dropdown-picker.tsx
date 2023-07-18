import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import DropDownPicker, {
  DropDownPickerProps,
} from 'react-native-dropdown-picker';

import {Colors} from '../../../../../constants/color.const';
import {IProvince} from '../../../interfaces/base-dto/province.interface';
import * as ds from '../../../services/divisions.service';

interface IProps {
  fnUpdateProvince: Function;
}
const ProvincesDropdownPicker: React.FC<
  IProps & Partial<DropDownPickerProps<any>>
> = ({zIndex, zIndexInverse, fnUpdateProvince}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [itemsFullData, setItemsFullData] = useState<IProvince[]>([]);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Show the loading animation
    setLoading(true);

    // Get items from API
    const resp: IProvince[] = await ds.searchProvinces({
      q: text,
    });

    // Set items for the dropdown
    const items = resp
      .map(item => ({
        label: item.name || '',
        value: item.code.toString() || '',
      }))
      .filter(item => item.label !== '');

    setItems(items);
    setItemsFullData(resp);
    setLoading(false);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: Colors.background.white,
        borderRadius: 10,
        marginVertical: 10,
        gap: 10,
        zIndex: zIndex,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: Colors.text.orange,
        }}>
        Tỉnh/thành phố
      </Text>

      <DropDownPicker
        style={{
          borderColor: Colors.border.lightgrey,
        }}
        listMode="MODAL"
        placeholder="Chọn tỉnh/thành phố"
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
          console.log(
            'itemsFullData.find(i => item?.value && i.code === +item?.value)',
            JSON.stringify(
              itemsFullData.find(i => item?.value && i.code === +item?.value),
            ),
          );

          fnUpdateProvince(
            itemsFullData.find(i => item?.value && i.code === +item?.value),
          );
        }}
      />
    </View>
  );
};

export default observer(ProvincesDropdownPicker);
