import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const fontScale = Dimensions.get('window').fontScale;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: width,
    minHeight: '100%',
  },
  groupInfoContainer: {
    display: 'flex',
    width: width * 0.9,
    gap: 20,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 14,
    color: Colors.text,
  },
  infoText: {
    fontSize: 14,
    color: Colors.secondary,
  },
  title: {
    width: '90%',
    marginVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  button: {
    // width: '90%',
    // content: 'fill',
    // display: 'flex',
    // justifyContent: 'center',
    // flexDirection: 'row',
    // alignItems: 'center',
    // margin: 10,
    // padding: 8,
    // backgroundColor: Colors.primary,
    // borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '100%',
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
