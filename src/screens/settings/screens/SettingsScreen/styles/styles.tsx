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
    color: Colors.text,
    fontSize: 16,
  },
  settingsContainer: {
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
  button: {
    width: '90%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dividerContainer: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dividerText: {textAlignVertical: 'center', color: 'grey'},
  divider: {
    marginVertical: 20,
    width: '40%',
    borderBottomColor: Colors.secondary,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 1,
  },
  settingIcon: {
    fontWeight: '200',
    color: Colors.text,
    fontSize: 22,
  },
  notiIcon: {
    fontWeight: '200',
    color: Colors.primary,
    fontSize: 22,
  },
  settingItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
