import { ElementType } from "react";
import { Icon } from "./ui/icon";
import { ActivityIndicator } from "react-native";

const DynamicIcon = ({
  icon,
  predictPending,
}: {
  icon: ElementType<any>;
  predictPending: boolean;
}) => {
  return predictPending ? (
    <ActivityIndicator
      size="small"
      style={{ width: 2, marginRight: 12 }}
      color="white"
    />
  ) : (
    <Icon className="text-typography-100 w-4 h-4 mb-1" as={icon} />
  );
};

export default DynamicIcon;
