import {Formik} from 'formik';
import React, {Fragment, useState} from 'react';
import {Button, TextInput, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import appStore from '../../store/app.store';
import searchStore from '../../store/search.store';
import {styles} from './styles';

const SearchComp = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (text: string) => {
    setInputValue(text);
    console.log('text: ', text);
  };

  const onPress = () => {
    console.log('Search button pressed');

    // do search
    searchStore.setSearchText(inputValue);
    if (inputValue !== '') {
      searchStore.doSearch();
    }
  };

  return appStore.searchActive ? (
    <Fragment>
      <TextInput
        value={inputValue}
        onChangeText={handleInputChange}
        placeholder="Tìm kiếm ..."
        style={styles.textInput}
      />
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="search-outline" size={24} color={'black'} />
      </TouchableOpacity>
    </Fragment>
  ) : null;
};

export default SearchComp;
