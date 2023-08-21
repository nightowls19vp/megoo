import {useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import groupStore from './../../../../../common/store/group.store';
import {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik, FormikHelpers, FormikValues} from 'formik';

const CreateFundScreen = () => {
  const navigation = useNavigation();

  const [funds, setFunds] = useState<
    {
      _id: string;
      createdAt: string;
      description: string;
      ends: string;
      history: any[];
      members: {
        _id: string;
        email: string;
        name: string;
        avatar: string;
      }[];
      startDate: string;
      summary: string;
      times: number;
      total: number;
      updatedAt: string;
    }[]
  >([]);

  useEffect(() => {}, []);

  return (
    <Formik
      initialValues={{
        summary: '',
        description: '',
        total: '',
        startDate: '',
        ends: '',
      }}
      onSubmit={values => {
        console.log('values', values);
      }}>
      {({
        values,
        setFieldTouched,
        setFieldValue,
        handleChange,
        handleSubmit,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, {marginTop: 10}]}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              style={styles.inputText}
              placeholder={'Nhập tiêu đề'}
              placeholderTextColor={Colors.text.lightgrey}
              value={''}
            />
            {values.summary && (
              <Ionicons
                onPress={() => setFieldValue('description', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          <Text style={[styles.title, {marginTop: 10}]}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              style={styles.inputText}
              placeholder={'Nhập mô tả'}
              placeholderTextColor={Colors.text.lightgrey}
              value={''}
            />
            {values.description && (
              <Ionicons
                onPress={() => setFieldValue('description', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  titleContainer: {
    width: '90%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
    marginTop: 10,
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
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
});

export default CreateFundScreen;
