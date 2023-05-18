import {StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    // flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingTop: 10,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.primary,
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.secondary,
    fontSize: 20,
  },
  error: {
    width: '80%',
    color: Colors.error,
    textAlign: 'left',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    marginTop: 20,
  },
});

export default styles;
