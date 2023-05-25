import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    minHeight: height,
    // justifyContent: 'center',
  },
  titleContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  title: {
    textAlign: 'left',
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 12,
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    color: Colors.primary,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
  },
  groupContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  groupInfo: {
    display: 'flex',
    width: '100%',
    gap: 20,
    marginVertical: 10,
  },
  groupAvatar: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    marginHorizontal: 10,
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

export default styles;
