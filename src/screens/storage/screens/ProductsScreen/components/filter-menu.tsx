import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-elements';

import {Colors} from '../../../../../constants/color.const';
import Modal from 'react-native-modal';
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSortByChange: (value: string | null) => void;
  onStockStatusChange: (value: string | null) => void;
  onStorageLocationChange: (value: string | null) => void;
  onPurchaseLocationChange: (value: string | null) => void;
}
const FilterMenu: React.FC<FilterModalProps> = ({isVisible, onClose}) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<string | null>(null);
  const [storageLocation, setStorageLocation] = useState<string | null>(null);
  const [purchaseLocation, setPurchaseLocation] = useState<string | null>(null);

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      hasBackdrop={true}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}>
      <View style={styles.menuContainer}>
        <Text>Sort By:</Text>
        {/* Implement your sort options */}

        <Text>Stock Status:</Text>
        {/* Implement your stock status options */}

        <Text>Storage Location:</Text>
        {/* Implement the dropdown for storage location */}

        <Text>Purchase Location:</Text>
        {/* Implement the dropdown for purchase location */}

        <Button
          title="Apply"
          onPress={() => {
            /* Apply filters */
          }}
        />
        <Button
          title="Reset"
          onPress={() => {
            /* Reset filters */
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is the important style you need to set
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: Colors.background.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderColor: Colors.border.lightgrey,
    // borderWidth: 1,
  },
});

export default FilterMenu;
