import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Colors} from '../../../../../constants/color.const';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onUse: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onDetail: () => void;
}

const BottomMenu: React.FC<Props> = ({
  isVisible,
  onClose,
  onUse,
  onUpdate,
  onDelete,
  onDetail,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop={true}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={onDetail}>
          <Ionicons name="md-information-circle" size={20} color="#f58500" />
          <Text style={styles.menuText}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onUpdate}>
          <Ionicons name="md-pencil" size={20} color="#f58500" />
          <Text style={styles.menuText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onUse}>
          <AntDesignIcon name="check" size={20} color="#f58500" />
          <Text style={styles.menuText}>Use</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
          <Ionicons name="md-trash" size={20} color="#f58500" />
          <Text style={styles.menuText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <MaterialIcons
            name="cancel"
            size={20}
            color="#f58500"></MaterialIcons>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is the important style you need to set
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: Colors.background.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    boxShadow: '0px -5px red;',

    // borderColor: Colors.border.lightgrey,
    // borderWidth: 1,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    color: Colors.text.orange,
    marginTop: 5,
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.text.orange,
    marginTop: 10,
  },
});

export default BottomMenu;
