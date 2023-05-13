import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  packageContainer: {
    width: '90%',
    marginBottom: 20,
  },
  contentContainer: {
    width: '90%',
    marginVertical: 20,
    backgroundColor: Colors.background,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    borderRadius: 10,
    padding: 10,
  },
});

export default styles;
