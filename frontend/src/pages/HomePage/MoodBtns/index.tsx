import { Box, SlideFade, useDisclosure } from "@chakra-ui/react";
import moment, { Moment } from "moment";
import { useState } from "react";
import { MoodValue } from "../../../api/user";
import ModalMoodStreak from "../../../components/ModalMoodStreak";
import MoodBtn from "../../../components/MoodBtn";
import MoodMessage from "../../../components/MoodMessage";

const MOOD_BTN_PROPS = [
  {
    icon: <img src="/assets/button/happy.svg"></img>,
    isDisabledIcon: <img src="/assets/button/happy-inactive.svg"></img>,
    value: MoodValue.HAPPY,
    bg: "hsl(140, 65%, 41%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(140, 65%, 30%) 0%, hsl(140, 65%, 41%) 50%, hsl(140, 65%, 55%) 100%)",
    bgDisabled: "hsl(220, 9%, 87%)",
    bgDisabledLinearGradient:
      "linear-gradient(to left, hsl(220, 9%, 77%) 0%, hsl(220, 9%, 87%) 50%, hsl(220, 9%, 97%) 100%)",
  },
  {
    icon: <img src="/assets/button/ok.svg"></img>,
    isDisabledIcon: <img src="/assets/button/ok-inactive.svg"></img>,
    value: MoodValue.OK,
    bg: "hsl(33, 91%, 58%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(33, 91%, 45%) 0%, hsl(33, 91%, 58%) 50%, hsl(33, 91%, 70%) 100%)",
    bgDisabled: "hsl(220, 9%, 87%)",
    bgDisabledLinearGradient:
      "linear-gradient(to left, hsl(220, 9%, 77%) 0%, hsl(220, 9%, 87%) 50%, hsl(220, 9%, 97%) 100%)",
  },
  {
    icon: <img src="/assets/button/sad.svg"></img>,
    isDisabledIcon: <img src="/assets/button/sad-inactive.svg"></img>,
    value: MoodValue.SAD,
    bg: "hsl(343, 79%, 64%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(343, 79%, 52%) 0%, hsl(343, 79%, 64%) 50%, hsl(343, 79%, 75%) 100%)",
    bgDisabled: "hsl(220, 9%, 87%)",
    bgDisabledLinearGradient:
      "linear-gradient(to left, hsl(220, 9%, 77%) 0%, hsl(220, 9%, 87%) 50%, hsl(220, 9%, 97%) 100%)",
  },
];

const MOOD_MESSAGE_PROPS = {
  [MoodValue.HAPPY]: {
    bg: "hsl(140, 65%, 41%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(140, 65%, 30%) 0%, hsl(140, 65%, 41%) 50%, hsl(140, 65%, 55%) 100%)",
  },
  [MoodValue.OK]: {
    bg: "hsl(33, 91%, 58%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(33, 91%, 45%) 0%, hsl(33, 91%, 58%) 50%, hsl(33, 91%, 70%) 100%)",
  },
  [MoodValue.SAD]: {
    bg: "hsl(343, 79%, 64%)",
    bgLinearGradient:
      "linear-gradient(to left, hsl(343, 79%, 52%) 0%, hsl(343, 79%, 64%) 50%, hsl(343, 79%, 75%) 100%)",
  },
};

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
  moodMessage: string;
  streak: number;
  onClick: (mood: MoodValue) => Promise<void>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isShowMoodMessage, setIsShowMoodMessage] = useState(false);
  const [clickedMood, setClickedMood] = useState(MoodValue.HAPPY);
  const [timerId, setTimerId] = useState(null);

  const handleClick = async (mood: MoodValue) => {
    setClickedMood(mood);
    await props.onClick(mood);
    setIsShowMoodMessage(true);
    await new Promise((r) => setTimeout(r, 5000));
    setIsShowMoodMessage(false);

    onOpen();
    const id = setTimeout(onClose, 4000);
    setTimerId(id);
  };

  const handleClose = () => {
    clearTimeout(timerId);
    onClose();
  };

  if (isShowMoodMessage) {
    return (
      <Box
        display="flex"
        className="dashboard--bottom"
        justifyContent="space-between"
        paddingX="54px"
        paddingY="18px"
        gap="48px"
        height="100%"
        maxHeight="218px"
        bg="#D7FFB8"
      >
        <SlideFade
          in={isShowMoodMessage}
          style={{ width: "100%" }}
          transition={{ enter: { duration: 0.5 }, exit: { duration: 1 } }}
        >
          <MoodMessage
            bg={MOOD_MESSAGE_PROPS[clickedMood].bg}
            bgLinearGradient={MOOD_MESSAGE_PROPS[clickedMood].bgLinearGradient}
            message={props.moodMessage}
          ></MoodMessage>
        </SlideFade>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      className="dashboard--bottom"
      justifyContent="space-between"
      paddingX="54px"
      paddingY="18px"
      gap="48px"
      height="100%"
      maxHeight="218px"
    >
      {MOOD_BTN_PROPS.map((prop) => {
        return (
          <Box width="100%">
            <MoodBtn
              onClick={() => handleClick(prop.value)}
              icon={prop.icon}
              isDisabledIcon={prop.isDisabledIcon}
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
