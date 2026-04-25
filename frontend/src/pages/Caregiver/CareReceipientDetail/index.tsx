import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Banner } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCareReceipientDetailResponse } from "../../../api/getCareReceipientDetailResponse";
import { AppLanguage, CareReceipientDetailMoodOut, SelectedMood } from "../../../api/types";
import { FormFieldsViewCareReceipient } from "../../../components/FormFieldsViewCareReceipient";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import { IconMood } from "../../../components/IconMood";
import { VIEW_CARE_RECEIPIENT_FORM_FIELDS_PROPS } from "../constants";
import ModalUpdateCareReceipient from "../UpdateCareReceipient";

const getDayAbbreviation = (date: Date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

const getMonthDayAbbreviation = (date: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const mmm = months[date.getMonth()];
  const dd = ("0" + date.getDate()).slice(-2);
  return `${dd} ${mmm}`;
};

const ToggleShowHidePersonalInformation = (props: {
  isShowPersonalInformation: boolean;
  setIsShowInformation: (isShowInformation: boolean) => void;
}) => {
  return (
    <Button
      onClick={() =>
        props.setIsShowInformation(!props.isShowPersonalInformation)
      }
      display="flex"
      gap="6px"
    >
      {props.isShowPersonalInformation ? <ViewIcon /> : <ViewOffIcon />}
      <Text>
        {props.isShowPersonalInformation
          ? "Show information"
          : "Hide information"}
      </Text>
    </Button>
  );
};

const getSadDaysCount = (moods: CareReceipientDetailMoodOut[]) => {
  return moods.slice(0, 7).filter((mood) => mood.mood === SelectedMood.SAD).length;
};

const UserMoodHistoryTable = (props: { moods: CareReceipientDetailMoodOut[] }) => {
  const lastSevenDays = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return date;
  });

  return (
    <TableContainer>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th textTransform="none" colSpan={7} textAlign="center">
              Mood History
            </Th>
          </Tr>
          <Tr>
            {lastSevenDays.map((day) => {
              return (
                <Th fontSize="8px" p="1px" textTransform="none">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <p>{getDayAbbreviation(day)}</p>
                    <p>{getMonthDayAbbreviation(day)}</p>
                  </Box>
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {props.moods.slice(0, 7).map((mood) => {
              return (
                <Td>
                  <IconMood
                    mood={mood.mood}
                    isToday={
                      new Date(mood.created_at).toDateString() ===
                      new Date().toDateString()
                    }
                  ></IconMood>
                </Td>
              );
            })}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const CareReceipientDetail = () => {
  const { userId } = useParams();
  const [isShowPersonalInformation, setIsShowInformation] =
    useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: adminUserData, isLoading } = useGetCareReceipientDetailResponse(
    Number(userId)
  );

  const handleGearIconClick = (userId: string) => {
    navigate(`/admin/${userId}/settings`);
  };
  const handleBackIconClick = () => {
    navigate(`/admin`);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  if (isLoading || !adminUserData || !userId) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        className="page"
        bg="url('/assets/loading.svg')"
      ></Box>
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Box
        className="page"
        margin="18px"
        paddingBottom="24px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Box display="flex" gap="8px" justifyContent="space-between">
          <IconButton
            onClick={handleBackIconClick}
            isRound={true}
            variant="solid"
            aria-label="Done"
            icon={<IconArrowLeft />}
          />

          <Box
            display="flex"
            justifyContent="center"
            onClick={() => handleGearIconClick(userId)}
          >
            <img src="/assets/icon/gear.svg" />
          </Box>
        </Box>
        <Box display="flex" gap="4px" flexDirection="column">
          <Heading size="sm" color="#8080808C">
            Profile
          </Heading>
          <Heading size="sm">{adminUserData.alias}</Heading>
        </Box>
        {getSadDaysCount(adminUserData.moods.slice(0, 7)) > 2 && (
          <Banner size="sm" variant="error">
            Poor mood reported in the past{" "}
            {getSadDaysCount(adminUserData.moods.slice(0, 7))} days
          </Banner>
        )}

        <UserMoodHistoryTable moods={adminUserData.moods} />
        <Box display="flex" gap="4px">
          <Heading size="sm">Personal Information</Heading>
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => setIsEditModalOpen(true)}
          >
            <img height="18px" width="18px" src="/assets/icon/edit.svg" />
          </Box>
        </Box>
        <FormFieldsViewCareReceipient
          createCareReceipientForm={{
            contactNumber: adminUserData.contact_number,
            name: adminUserData.name,
            age: adminUserData.age,
            alias: adminUserData.alias,
            race: adminUserData.race,
            gender: adminUserData.gender,
            appLanguage: AppLanguage.ENGLISH,
            postalCode: adminUserData.postal_code,
            floor: adminUserData.floor,
            block: adminUserData.block,
            unit: adminUserData.unit,
          }}
          createUpdateCareReceipientFormFields={VIEW_CARE_RECEIPIENT_FORM_FIELDS_PROPS}
          isShowPersonalInformation={isShowPersonalInformation}
        />
        <ToggleShowHidePersonalInformation
          isShowPersonalInformation={isShowPersonalInformation}
          setIsShowInformation={setIsShowInformation}
        />
      </Box>
      <ModalUpdateCareReceipient
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={userId}
        dashboardData={adminUserData}
      />
    </Box>
  );
};

export default CareReceipientDetail;
