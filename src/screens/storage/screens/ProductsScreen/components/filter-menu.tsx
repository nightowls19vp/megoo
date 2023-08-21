import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';

import {Colors} from '../../../../../constants/color.const';
import Modal from 'react-native-modal';
import groupStore from '../../../../../common/store/group.store';
import PurchaseLocationDropdownPicker from '../../../components/PurchaseLocationDropdownPicker';
import StorageLocationDropdownPicker from '../../../components/StorageLocationDropdownPicker';
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSortByChange: (value: string | null) => void;
  onStockStatusChange: (value: string | null) => void;
  onStorageLocationChange: (value: string | null) => void;
  onPurchaseLocationChange: (value: string | null) => void;
}
const FilterMenu: React.FC<FilterModalProps> = props => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<string | null>(null);
  const [storageLocation, setStorageLocation] = useState<string | null>(null);
  const [purchaseLocation, setPurchaseLocation] = useState<string | null>(null);

  const sortOptions = {
    nameAsc: 'Tên tăng dần (A-Z)',
    nameDesc: 'Tên giảm dần (Z-A)',
  };

  const stockStatusOptions = {
    inStock: 'Còn đầy đủ',
    runningOutOfStock: 'Sắp hết',
    outOfStock: 'Hết',
  };

  return (
    <Modal
      isVisible={props.isVisible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      hasBackdrop={true}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      style={styles.modal}>
      <View style={styles.menuContainer}>
        <ScrollView>
          <View>
            <Text>Bo loc</Text>
          </View>
          <Text>Sort By:</Text>
          {/* Implement your sort options */}
          <Text>Stock Status:</Text>
          {/* Implement your stock status options */}
          <StorageLocationDropdownPicker
            groupId={groupStore.id}
            fnUpdateStorageLocationId={value =>
              props.onStorageLocationChange(value)
            }
          />
          <PurchaseLocationDropdownPicker
            groupId={groupStore.id}
            fnUpdatePurchaseLocationId={value =>
              props.onPurchaseLocationChange(value)
            }
          />
        </ScrollView>
        <View style={[styles.buttonGroup]}>
          <TouchableOpacity
            style={[styles.buttonGroupItem, styles.applyButton]}
            onPress={() => {
              /* Apply filters */
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.text.white,
              }}>
              Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonGroupItem, styles.resetButton]}
            onPress={() => {
              /* Reset filters */
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.text.orange,
              }}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is the important style you need to set
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: '100%',
    position: 'relative',
  },
  menuContainer: {
    position: 'relative',
    borderColor: 'black',
    borderWidth: 1,
    width: '90%',
    backgroundColor: Colors.background.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderColor: Colors.border.lightgrey,
    // borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  // scrollContainer
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 100,
  },

  buttonGroup: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    height: 90,
    justifyContent: 'space-between',
  },

  buttonGroupItem: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    backgroundColor: Colors.background.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  applyButton: {
    backgroundColor: Colors.background.orange,
    borderColor: Colors.border.orange,
  },

  resetButton: {
    backgroundColor: Colors.background.white,
    borderColor: Colors.border.orange,
  },
});

export default FilterMenu;
