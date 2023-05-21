import {StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginHorizontal: 20,
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
  groupRow: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  groupInfo: {
    display: 'flex',
    gap: 10,
    marginVertical: 10,
  },
});

export default styles;
