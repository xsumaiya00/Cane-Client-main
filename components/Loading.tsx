import { Spinner } from "@/components/ui/spinner";
import { Center } from "@/components/ui/center";
import { gray } from "tailwindcss/colors";
import Wrapper from "./Wrapper";

export default function Loading() {
  return (
    <Wrapper>
      <Center className="flex-1">
        <Spinner size="large" color={gray[500]} />
      </Center>
    </Wrapper>
  );
}
