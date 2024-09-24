import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import moment, { Moment } from "moment";
import { useState } from "react";
import { MoodValue } from "../../../api/dashboard";
import ModalMoodStreak from "../../../components/ModalMoodStreak";
import MoodBtn from "../../../components/MoodBtn";

const MOOD_BTN_PROPS = [
  {
    icon: <img src="/src/assets/happy.svg"></img>,
    value: MoodValue.HAPPY,
    bg: "hsl(140, 65%, 41%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(140, 65%, 30%) 0%, hsl(140, 65%, 41%) 50%, hsl(140, 65%, 55%) 100%)",
    bgDisabled: "hsl(220, 9%, 87%)",
    bgDisabledLinearGradient:
      "linear-gradient(to left, hsl(220, 9%, 77%) 0%, hsl(220, 9%, 87%) 50%, hsl(220, 9%, 97%) 100%)",
  },
  {
    icon: <img src="/src/assets/ok.svg"></img>,
    value: MoodValue.OK,
    bg: "hsl(33, 91%, 58%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(33, 91%, 45%) 0%, hsl(33, 91%, 58%) 50%, hsl(33, 91%, 70%) 100%)",
    bgDisabled: "hsl(220, 9%, 87%)",
    bgDisabledLinearGradient:
      "linear-gradient(to left, hsl(220, 9%, 77%) 0%, hsl(220, 9%, 87%) 50%, hsl(220, 9%, 97%) 100%)",
  },
  {
    icon: <img src="/src/assets/sad.svg"></img>,
    value: MoodValue.SAD,
    bg: "hsl(343, 79%, 64%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(343, 79%, 52%) 0%, hsl(343, 79%, 64%) 50%, hsl(343, 79%, 75%) 100%)",
    bgDisabled: "hsl(220, 9%, 87%)",
    bgDisabledLinearGradient:
      "linear-gradient(to left, hsl(220, 9%, 77%) 0%, hsl(220, 9%, 87%) 50%, hsl(220, 9%, 97%) 100%)",
  },
];

function getDaysOfWeek(): Moment[] {
  const startOfWeek = moment().startOf("week");

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(startOfWeek.clone().add(i, "days"));
  }
  return daysOfWeek;
}

function getCheckedDaysBoolean(
  daysOfWeek: Moment[],
  checkedDays: Moment[]
): boolean[] {
  return daysOfWeek.map((dayOfWeek) =>
    checkedDays.some((checkedDay) => dayOfWeek.isSame(checkedDay, "day"))
  );
}

function MoodBtns(props: {
  isDisabled: boolean;
  moodsCreatedAt: Moment[];
  streak: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timerId, setTimerId] = useState(null);

  const handleClick = () => {
    onOpen();
    const id = setTimeout(onClose, 5000);
    setTimerId(id);
  };

  const handleClose = () => {
    clearTimeout(timerId);
    onClose();
  };

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
              onClick={handleClick}
              icon={prop.icon}
              isDisabled={props.isDisabled}
              bg={prop.bg}
              bgLinearGradient={prop.bgLinearGradient}
              bgDisabled={prop.bgDisabled}
              bgDisabledLinearGradient={prop.bgDisabledLinearGradient}
            ></MoodBtn>
          </Box>
        );
      })}
      <ModalMoodStreak
        isOpen={isOpen}
        handleClose={handleClose}
        daysOfWeek={getDaysOfWeek().map((dayOfWeek) =>
          dayOfWeek.format("dddd").slice(0, 3)
        )}
        tickData={getCheckedDaysBoolean(getDaysOfWeek(), props.moodsCreatedAt)}
        streak={props.streak}
      ></ModalMoodStreak>
    </Box>
  );
}

export default MoodBtns;
