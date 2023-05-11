import {StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    marginBottom: 10,
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
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  editText: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    color: Colors.primary,
  },
  infoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
  },
  infoText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  connectText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
