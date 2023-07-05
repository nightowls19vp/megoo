import {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {dateFormat} from '../../../../common/handle.string';
import {getPkgsByGroupId} from './services/packages.service';
import styles from './styles/style';

type OtherPackagesProps = {
  groupId: string;
  // ...other parameters
};

const OtherPackages = (props: {navigation: any} & OtherPackagesProps) => {
  const [packages, setPackages] = useState([
    {
      pkgId: '',
      pkgName: '',
      pkgPrice: '',
      pkgDuration: 0,
      pkgNoOfMember: 0,
      pkgDescription: '',
      pkgStartDate: '',
      pkgEndDate: '',
      pkgStatus: '',
    },
  ]);

  const {groupId} = props;

  const getPkgs = async () => {
    console.log('prop:', props.groupId);

    // Get all user's groups
    const groupsRes = await getPkgsByGroupId(groupId);
    console.log('getPkgsRes:', groupsRes.group.packages);

    // Filter out active package
    const otherPkgs = groupsRes.group.packages.filter(
      (pkgItem: any) => pkgItem.status !== 'Active',
    );

    console.log('otherPkgs:', otherPkgs);

    if (otherPkgs.length !== 0) {
      // Set packages list
      setPackages(
        groupsRes.group.packages.map((pkgItem: any) => {
          return {
            pkgId: pkgItem.package._id ? pkgItem.package._id : '',
            pkgName: pkgItem.package.name ? pkgItem.package.name : '',
            pkgPrice: pkgItem.package.price ? pkgItem.package.price : '',
            pkgDuration: pkgItem.package.duration
              ? pkgItem.package.duration
              : 0,
            pkgNoOfMember: pkgItem.package.noOfMember
              ? pkgItem.package.noOfMember
              : 0,
            pkgDescription: pkgItem.package.description
              ? pkgItem.package.description
              : '',
            pkgStartDate: pkgItem.startDate
              ? dateFormat(pkgItem.startDate)
              : '',
            pkgEndDate: pkgItem.endDate ? dateFormat(pkgItem.endDate) : '',
            pkgStatus: pkgItem.status ? pkgItem.status : '',
          };
        }),
      );
    } else {
      setPackages([]);
    }
  };

  useEffect(() => {
    getPkgs();
  }, []);

  const renderPackageItem = () => {
    if (packages.length === 0) {
      return packages.map((pkgItem: any, index) => {
        return (
          <TouchableOpacity key={index} style={styles.packageContainer}>
            <View style={styles.packageContent}>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Tên gói:{' '}
                </Text>
                <Text style={styles.infoText}>{pkgItem.pkgName}</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Thời hạn:{' '}
                </Text>
                <Text style={styles.infoText}>{pkgItem.pkgDuration} tháng</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Số lượng thành viên:{' '}
                </Text>
                <Text style={styles.infoText}>{pkgItem.pkgNoOfMember}</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Ngày bắt đầu:{' '}
                </Text>
                <Text style={styles.infoText}>{pkgItem.pkgStartDate}</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Ngày hết hạn:{' '}
                </Text>
                <Text style={styles.infoText}>{pkgItem.pkgEndDate}</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>Mô tả: </Text>
                <Text style={styles.infoText}>{pkgItem.pkgDescription}</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Trạng thái:{' '}
                </Text>
                <Text style={styles.infoText}>{pkgItem.pkgStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    } else {
      return null;
    }
  };

  return <View style={styles.container}>{renderPackageItem()}</View>;
};

export default OtherPackages;
