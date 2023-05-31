import {StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.screenBackground,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginVertical: 10,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  settingsContainer: {
    width: '90%',
    marginBottom: 10,
  },
  contentContainer: {
    backgroundColor: Colors.itemBackground,
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
    marginTop: 40,
    padding: 8,
    backgroundColor: Colors.screenBackground,
    borderRadius: 10,
    borderColor: Colors.buttonSecondary,
    borderWidth: 1,
  },
  buttonText: {
    color: Colors.textSecondary,
    fontSize: 18,
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
    color: Colors.buttonPrimary,
    fontSize: 22,
  },
  notiIcon: {
    fontWeight: '200',
    color: Colors.buttonPrimary,
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
