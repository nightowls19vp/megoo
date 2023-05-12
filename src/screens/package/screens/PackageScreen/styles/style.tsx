import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    // flexGrow  cannot be applied directly within flex: 1
    flexGrow: 1,
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
  pkgTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 10,
    textAlign: 'center',
  },
  carouselItem: {
    width: width * 0.55,
    backgroundColor: Colors.background,
    // borderWidth: 1,
    // borderColor: 'black',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    paddingHorizontal: 10,
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginVertical: 10,
  },
  descriptionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 5,
    marginVertical: 10,
  },
});

export default styles;
