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
import { useGetCareReceipientDetailResponse } from "@/api/getCareReceipientDetailResponse";
import { useGetCareReceipientLoginUrlResponse } from "@/api/getCareReceipientLoginUrlResponse";
import { CareReceipientDetailMoodOut, SelectedMood } from "@/api/types";
import { FormFieldsViewCareReceipient } from "@/components/FormFieldsViewCareReceipient";
import ShareLoginLinkCard from "@/components/ShareLoginLinkCard";
import { IconArrowLeft } from "@/components/IconArrowLeft";
import { IconMood } from "@/components/IconMood";
import { VIEW_CARE_RECEIPIENT_FORM_FIELDS_PROPS } from "@/pages/Caregiver/constants";
import ModalUpdateCareReceipient from "@/pages/Caregiver/UpdateCareReceipient";

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
  const { careReceipientId } = useParams();
  const [isShowPersonalInformation, setIsShowInformation] =
    useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: careReceipientData, isLoading } = useGetCareReceipientDetailResponse(
    Number(careReceipientId)
  );
  const { data: loginUrlData } = useGetCareReceipientLoginUrlResponse(
    Number(careReceipientId)
  );

  const handleGearIconClick = (careReceipientId: string) => {
    navigate(`/dashboard/care-receipient/${careReceipientId}/settings`);
  };
  const handleBackIconClick = () => {
    navigate(`/dashboard`);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  if (isLoading || !careReceipientData || !careReceipientId) {
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
            onClick={() => handleGearIconClick(careReceipientId)}
          >
            <img src="/assets/icon/gear.svg" />
          </Box>
        </Box>
        <Box display="flex" gap="4px" flexDirection="column">
          <Heading size="sm" color="#8080808C">
            Profile
          </Heading>
          <Heading size="sm">{careReceipientData.name}</Heading>
        </Box>
        {getSadDaysCount(careReceipientData.moods.slice(0, 7)) > 2 && (
          <Banner size="sm" variant="error">
            Poor mood reported in the past{" "}
            {getSadDaysCount(careReceipientData.moods.slice(0, 7))} days
          </Banner>
        )}

        <UserMoodHistoryTable moods={careReceipientData.moods} />
        {loginUrlData?.url && (
          <ShareLoginLinkCard
            loginLink={loginUrlData.url}
            name={careReceipientData.name}
            careReceipientId={careReceipientData.care_receipient_id}
          />
        )}
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
            contactNumber: careReceipientData.contact_number,
            name: careReceipientData.name,
            age_range: careReceipientData.age_range,
            race: careReceipientData.race,
            gender: careReceipientData.gender,
            appLanguage: careReceipientData.app_language,
            postalCode: careReceipientData.postal_code,
            floor: careReceipientData.floor,
            block: careReceipientData.block,
            unit: careReceipientData.unit,
            hasAgreedToTermsAndConditions: false,
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
        careReceipientId={careReceipientId}
        dashboardData={careReceipientData}
      />
    </Box>
  );
};

export default CareReceipientDetail;
