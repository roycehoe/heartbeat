import { Box } from "@chakra-ui/react";
import { MoodValue } from "../../../api/dashboard";
import MoodBtn from "../../../components/MoodBtn";

const MOOD_BTN_PROPS = [
  {
    icon: <img src="/src/assets/happy.svg"></img>,
    value: MoodValue.HAPPY,
    bg: "hsl(140, 65%, 41%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(140, 65%, 30%) 0%, hsl(140, 65%, 41%) 50%, hsl(140, 65%, 55%) 100%)",
  },
  {
    icon: <img src="/src/assets/ok.svg"></img>,
    value: MoodValue.OK,
    bg: "hsl(33, 91%, 58%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(33, 91%, 45%) 0%, hsl(33, 91%, 58%) 50%, hsl(33, 91%, 70%) 100%)",
  },
  {
    icon: <img src="/src/assets/sad.svg"></img>,
    value: MoodValue.SAD,
    bg: "hsl(343, 79%, 64%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(343, 79%, 52%) 0%, hsl(343, 79%, 64%) 50%, hsl(343, 79%, 75%) 100%)",
  },
];

function MoodBtns() {
  return (
    <Box
      display="flex"
      bg="green.400"
      className="dashboard--bottom"
      justifyContent="space-between"
      gap="48px"
      height="100%"
      maxHeight="188px"
    >
      {MOOD_BTN_PROPS.map((prop) => {
        return (
          <Box width="100%" bg="red.200">
            <MoodBtn
              icon={prop.icon}
              bg={prop.bg}
              bgLinearGradient={prop.bgLinearGradient}
            ></MoodBtn>
          </Box>
        );
      })}
    </Box>
  );
}

export default MoodBtns;
