import { Icon } from "@/components/ui/icon";
import {
  Mic,
  FileText,
  Edit3,
  Camera,
  Gamepad2,
  Brain,
} from "lucide-react-native";

export const modules = [
  {
    icon: <Icon as={Mic} size="xl" color="black" />,
    title: "Speech",
    description:
      "Answer to questions using your microphone. Emotions are captured after recording.",
  },
  {
    icon: <Icon as={FileText} size="xl" color="black" />,
    title: "Text",
    description:
      "Express your thoughts and feelings through structured writing prompts.",
  },
  {
    icon: <Icon as={Edit3} size="xl" color="black" />,
    title: "Handwriting",
    description: "Get feedback through handwriting and doodling exercises.",
  },
  {
    icon: <Icon as={Camera} size="xl" color="black" />,
    title: "Camera",
    description: "Capture and reflect on your emotions through photography.",
  },
  {
    icon: <Icon as={Gamepad2} size="xl" color="black" />,
    title: "Games",
    description:
      "Engage in fun, brain-training games to boost your cognitive skills.",
  },
  {
    icon: <Icon as={Brain} size="xl" color="black" />,
    title: "Brain Signals",
    description:
      "Use additional hardware that helps capturing your mind state.",
  },
];
