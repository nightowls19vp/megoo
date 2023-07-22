import Modal from 'react-native-modal';
import {Text, View} from 'react-native';
import {Colors} from '../../../constants/color.const';
import {TouchableOpacity} from 'react-native';

import {FC, useState} from 'react';
import {observer} from 'mobx-react';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {IMAGE_URI_DEFAULT} from '../../../common/default';

interface IImageSelectionOptionModalProps {
  title: string;
  isModalOpen: boolean;
  setIsModalOpen: (state: boolean) => void;
  // optional
  fnUpdateSelectedImage?: (image: string) => void; //set selected image from parent component
}

const AddImageModal: FC<IImageSelectionOptionModalProps> = ({
  title,
  isModalOpen,
  setIsModalOpen,
  fnUpdateSelectedImage,
}) => {
  const [imageFile, setImageFile] = useState<any>();
  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);

  return (
    <Modal isVisible={isModalOpen}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: Colors.background.white,
          borderRadius: 10,
          padding: 20,
          gap: 15,
        }}>
        <Text
          style={{
            fontSize: 20,
            color: Colors.title.orange,
            fontWeight: 'bold',
          }}>
          {'title'}
        </Text>

        <View
          style={{
            width: '100%',
            display: 'flex',
            gap: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              launchCamera(
                {
                  mediaType: 'photo',
                  cameraType: 'back',
                },
                response => {
                  console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    setSelectedImage(`${source[0].uri}`);
                    setImageFile(source[0].base64);
                    // console.log('File:', source[0].base64);
                  }
                },
              );
            }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'justify',
                color: Colors.text.grey,
                fontWeight: 'bold',
              }}>
              Chụp hình
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await launchImageLibrary(
                // If need base64String, include this option:
                // includeBase64: true
                {mediaType: 'mixed', includeBase64: true},
                response => {
                  // console.log('Response = ', response);
                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    setSelectedImage(`${source[0].uri}`);
                    setImageFile(source[0].base64);
                    // console.log('File:', source[0].base64);
                  }
                },
              );
            }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'justify',
                color: Colors.text.grey,
                fontWeight: 'bold',
              }}>
              Chọn từ thư viện
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log('Clicked');
            setIsModalOpen(!isModalOpen);
          }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'right',
              color: Colors.text.grey,
            }}>
            Đóng
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// const AddImageModal = ({title, isOpen}: {title: string; isOpen: boolean}) => {
//   return (
//     <Modal isVisible={isOpen}>
//       <View
//         style={{
//           width: '100%',
//           // display: 'flex',
//           // justifyContent: 'center',
//           backgroundColor: Colors.background.white,
//           // borderRadius: 10,
//           // padding: 20,
//           // gap: 15,
//         }}>
//         <Text
//           style={{
//             fontSize: 20,
//             color: Colors.title.orange,
//             fontWeight: 'bold',
//           }}>
//           {title}
//         </Text>
//         {/*
//         <View
//           style={{
//             width: '100%',
//             display: 'flex',
//             gap: 15,
//           }}>
//           <TouchableOpacity>
//             <Text
//               style={{
//                 fontSize: 16,
//                 textAlign: 'justify',
//                 color: Colors.text.grey,
//                 fontWeight: 'bold',
//               }}>
//               Chụp hình
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text
//               style={{
//                 fontSize: 16,
//                 textAlign: 'justify',
//                 color: Colors.text.grey,
//                 fontWeight: 'bold',
//               }}>
//               Chọn từ thư viện
//             </Text>
//           </TouchableOpacity>
//         </View> */}

//         <TouchableOpacity
//           onPress={() => {
//             console.log('Clicked');

//             // fnOpenModal(!isOpen);
//           }}>
//           <Text
//             style={{
//               fontSize: 16,
//               textAlign: 'right',
//               color: Colors.text.grey,
//             }}>
//             Đóng
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </Modal>
//   );
// };
export default observer(AddImageModal);
