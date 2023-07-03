import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    width: width,
    minHeight: height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
    marginTop: 10,
  },
  // inputContainer: {
  //   width: '90%',
  //   borderRadius: 10,
  //   padding: 10,
  // },
  textInput: {
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.lightgrey,
    padding: 10,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
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
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
  lenderContainer: {
    display: 'flex',
    width: '90%',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    marginVertical: 10,
    gap: 10,
    zIndex: 999,
  },
  borrowerContainer: {
    display: 'flex',
    width: '90%',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    marginVertical: 10,
    gap: 10,
  },
  addBorrowerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // marginVertical: 5,
    zIndex: 999,
    // gap: 10,
  },
  amountContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.lightgrey,
    paddingLeft: 5,
    paddingRight: 10,
  },
  addBorrowerButton: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    backgroundColor: Colors.buttonBackground.white,
    // marginVertical: 5,
  },
  addBorrowerButtonText: {
    color: Colors.text.orange,
    fontSize: 16,
    fontWeight: 'bold',
  },
  borrowersContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 10,
    marginBottom: 10,
  },
  borrowerAvatar: {
    width: Dimensions.get('window').height * 0.1,
    height: Dimensions.get('window').height * 0.1,
    borderRadius: (Dimensions.get('window').height * 0.1) / 2,
  },
  borrowerInfo: {
    width: '60%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // backgroundColor: 'pink',
  },
  borrowerInfoRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    // gap: 10,
  },
  headingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.grey,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: Colors.text.lightgrey,
  },
  deleteIcon: {
    fontWeight: '200',
    color: 'red',
    fontSize: 24,
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    width: '90%',
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.orange,
    borderRadius: 10,
    marginVertical: 20,
  },
});

export default styles;
