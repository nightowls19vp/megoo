import Modal from 'react-native-modal';
import {Text, View} from 'react-native';
import {Colors} from '../../../constants/color.const';
import {TouchableOpacity} from 'react-native';

import {FC, useState} from 'react';
import {observer} from 'mobx-react';

interface IImageSelectionOptionModalProps {
  title: string;
  modalState: boolean;
  setModalState: (state: boolean) => void;
  // optional
  fnUpdateSelectedImage?: (image: string) => void; //set selected image from parent component
}

const AddImageModal: FC<IImageSelectionOptionModalProps> = ({
  title,
  modalState,
  setModalState,
  fnUpdateSelectedImage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal isVisible={modalState}>
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
          <TouchableOpacity>
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
          <TouchableOpacity>
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
            setModalState(!modalState);
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
