import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    display: 'flex',
    alignItems: 'center',
    paddingTop: 10,
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },

  button: {
    width: '90%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    margin: 10,
    padding: 8,
    // backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.buttonText.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: Colors.text.grey,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  inputText: {flex: 1, color: Colors.text.grey},
  error: {
    width: '90%',
    color: Colors.error,
    textAlign: 'left',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    borderRadius: (Dimensions.get('window').width * 0.5) / 2,
  },
});

export default styles;
