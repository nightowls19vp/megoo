import {useEffect, useRef, useState} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {StyleSheet} from 'react-native';

import styles from './styles/style';

const ENTRIES1 = [
  {
    title: 'Beautiful and dramatic Antelope Canyon',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://naruto-official.com/common/ogp/NTOS_OG-main.png',
  },
  {
    title: 'Earlier this morning, NYC',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/UPrs1EWl.jpg',
  },
  {
    title: 'White Pocket Sunset',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
    illustration: 'https://i.imgur.com/MABUbpDl.jpg',
  },
  {
    title: 'Acrocorinth, Greece',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/KZsmUi2l.jpg',
  },
  {
    title: 'The lone tree, majestic landscape of New Zealand',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/2nCt3Sbl.jpg',
  },
];

const PackageScreen = () => {
  const width = Dimensions.get('window').width;

  const renderItem = ({item}: {item: any}) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'black',
          width: width * 0.5,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        key={item.id}>
        {/* <Image
          source={{uri: item.illustration}}
          style={{width: '100%', height: '100%'}}
        /> */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.packageContainer}>
        <Text style={styles.title}>Gói hiện tại</Text>
        <View style={styles.contentContainer}>
          <Text>Tên gói</Text>
          <Text>Ngày mua</Text>
          <Text>Thời hạn</Text>
          <Text>Giá tiền</Text>
          <Text>Số lượng thành viên</Text>
        </View>
      </View>

      <View style={{}}>
        <Text style={styles.title}>Các gói người dùng</Text>
        <Carousel
          // loop
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 130,
          }}
          width={width * 0.9}
          height={width * 0.9}
          //   autoPlay={true}
          data={ENTRIES1}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default PackageScreen;
