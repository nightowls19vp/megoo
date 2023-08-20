import {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tooltip from 'react-native-walkthrough-tooltip';

interface ITooltipProps {
  content: string;
  isTooltipVisible: boolean;
  setIsTooltipVisible: (state: boolean) => void; //set selected image from parent component
}

const ToolTip: FC<ITooltipProps> = ({
  content,
  isTooltipVisible,
  setIsTooltipVisible,
}) => {
  return (
    <Tooltip
      displayInsets={{top: 10, left: 10, right: 10, bottom: 10}}
      placement="bottom"
      isVisible={isTooltipVisible}
      onClose={() => setIsTooltipVisible(false)}
      content={<Text>{content}</Text>}>
      <TouchableOpacity onPress={() => setIsTooltipVisible(!isTooltipVisible)}>
        <Ionicons name="information-circle-outline" size={22} color={'black'} />
      </TouchableOpacity>
    </Tooltip>
  );
};

export default ToolTip;
