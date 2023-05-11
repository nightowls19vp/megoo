import {StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  packageContainer: {
    width: '90%',
    marginBottom: 20,
  },
  contentContainer: {
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
