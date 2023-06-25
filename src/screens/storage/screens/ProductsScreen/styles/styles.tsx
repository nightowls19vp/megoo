import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  productItemContainer: {
    width: '90%',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    // padding: 10,
  },
  productInfoContainer: {
    width: '70%',
    display: 'flex',
    gap: 10,
    padding: 10,
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  prodImg: {
    width: '30%',
    height: '100%',
    // borderRadius: 70 / 2,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
    textAlign: 'justify',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  modalTitleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  modalTitle: {
    width: '70%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  modalOptionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    // backgroundColor: 'pink',
  },
  modalOption: {
    width: '45%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  barcodeTextURL: {
    fontSize: 20,
    color: Colors.text.grey,
    fontWeight: 'bold',
    // backgroundColor: 'red',
  },
});

export default styles;
