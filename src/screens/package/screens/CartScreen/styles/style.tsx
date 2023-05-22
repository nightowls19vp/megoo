import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: width,
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 50,
  },
  cartListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingRight: 20,
  },
  cartItemContainer: {
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
  cartInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: Colors.text,
  },
  paymentButtonContainer: {
    width: '100%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    // paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
  },
  icon: {
    width: '10%',
    height: '100%',
    paddingLeft: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.background,
  },
  paymentButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '100%',
    backgroundColor: Colors.primary,
  },
});

export default styles;
