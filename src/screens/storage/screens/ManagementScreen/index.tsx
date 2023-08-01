import {observer} from 'mobx-react';
import {useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={{flex: 1, backgroundColor: '#ff4081'}}></View>
);

const SecondRoute = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const ManagementScreen = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};

export default observer(ManagementScreen);
