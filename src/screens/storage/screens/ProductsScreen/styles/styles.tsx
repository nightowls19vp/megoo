import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const fontScale = Dimensions.get('window').fontScale;

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  locationContainer: {
    width: width,
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  locationItem: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  locationImg: {
    width: 100,
    height: 100,
    // borderRadius: 70 / 2,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  locationInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  locationInfoRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    fontSize: fontScale * 14,
    color: Colors.text,
    textAlign: 'justify',
  },
  infoText: {
    fontSize: fontScale * 14,
    color: Colors.secondary,
    textAlign: 'justify',
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
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'red',
  },
});

export default styles;
