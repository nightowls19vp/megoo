import {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {getPkgsByGroupId} from './services/packages.service';
import styles from './styles/style';

type OtherPackagesProps = {
  groupId: string;
  // ...other parameters
};

const OtherPackages = (props: {navigation: any} & OtherPackagesProps) => {
  const [packages, setPackages] = useState([]);
  const {groupId} = props;

  const getGroups = async () => {
    console.log('prop:', props.groupId);

    // Get all user's groups
    const groupsRes = await getPkgsByGroupId(groupId);
    console.log('getPkgsRes:', groupsRes.group.packages);

    // setPackages(
    //   groupsRes.groups.map((groupItem: any) => {
    //     return {
    //       _id: groupItem._id,
    //       name: groupItem.name,
    //       avatar: groupItem.avatar,
    //       duration: groupItem.packages[0].package.duration,
    //       noOfMember: groupItem.packages[0].package.noOfMember,
    //       status: groupItem.packages[0].status,
    //     };
    //   }),
    // );
  };

  useEffect(() => {
    console.log(groupId);
    getGroups();
  }, []);

  return (
    <View>
      <Text>Group id: {groupId}</Text>
    </View>
  );
};

export default OtherPackages;
