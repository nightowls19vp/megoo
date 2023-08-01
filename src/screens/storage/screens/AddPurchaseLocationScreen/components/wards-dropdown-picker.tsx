import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import DropDownPicker, {
  DropDownPickerProps,
} from 'react-native-dropdown-picker';

import {Colors} from '../../../../../constants/color.const';
import {IWard} from '../../../interfaces/base-dto/ward.interface';
import * as ds from '../../../services/divisions.service';

interface IProps {
  dCode?: number;
  fnUpdateWard: Function;
}
const WardsDropdownPicker: React.FC<
  IProps & Partial<DropDownPickerProps<any>>
> = ({zIndex, zIndexInverse, disabled, dCode, fnUpdateWard}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [itemsFullData, setItemsFullData] = useState<IWard[]>([]);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Show the loading animation
    setLoading(true);

    if (!dCode) {
      setItems([]);
      setItemsFullData([]);
      setLoading(false);
      return;
    }

    // Get items from API
    const resp: IWard[] = await ds.searchWards({
      q: text,
      d: dCode,
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
        marginTop: 10,
        // gap: 10,
        zIndex: zIndex,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: Colors.text.orange,
        }}>
        Xã/phường
      </Text>
      <DropDownPicker
        listMode="MODAL"
        placeholder="Chọn xã/phường"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
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
        loading={loading}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        searchable={true}
        searchPlaceholder="Tìm kiếm ..."
        disableLocalSearch={true} // required for remote search
        onChangeSearchText={text => search(text)} // required for remote search
        autoScroll={true}
        onSelectItem={item => {
          fnUpdateWard(
            itemsFullData.find(i => item?.value && i.code === +item?.value),
          );
        }}
        disabled={disabled}
        disabledStyle={{
          opacity: 0.25,
        }}
      />
    </View>
  );
};

export default observer(WardsDropdownPicker);
