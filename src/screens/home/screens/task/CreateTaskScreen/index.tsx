import {useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {Colors} from '../../../../../constants/color.const';

type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const CreateTaskScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params.groupId;

  useEffect(() => {
    console.log('groupId', groupId);
  }, []);

  return (
    <Formik
      initialValues={{
        summary: '',
        description: '',
        startDate: '',
        endDate: '',
      }}
      enableReinitialize={true}
      onSubmit={values => {
        console.log('values', values);
      }}>
      {({
        setFieldValue,
        setFieldTouched,
        setFieldError,
        handleSubmit,
        isValid,
        values,
        errors,
        touched,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập tiêu đề sự kiện'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.summary}
            />
            {values.summary && (
              <Ionicons
                onPress={() => setFieldValue('summary', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.summary && errors.summary && (
            <Text style={styles.error}>{errors.summary}</Text>
          )}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập mô tả sự kiện'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.description}
            />
            {values.description && (
              <Ionicons
                onPress={() => setFieldValue('description', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.description && errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}
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
  title: {
    width: '90%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.title.orange,
    marginTop: 10,
  },
  inputContainer: {
    width: '90%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginBottom: 5,
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

export default CreateTaskScreen;
