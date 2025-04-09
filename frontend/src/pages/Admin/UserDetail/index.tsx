import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, IconButton, Text } from "@chakra-ui/react";
import { Banner, BxChevronLeft } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft } from "../../../components/IconArrowLeft";

const ToggleShowHidePersonalInformation = (props: {
  isShowInformation: boolean;
  setIsShowInformation: (isShowInformation: boolean) => void;
}) => {
  return (
    <Button
      onClick={() => props.setIsShowInformation(!props.isShowInformation)}
      display="flex"
      gap="6px"
    >
      {props.isShowInformation ? <ViewIcon /> : <ViewOffIcon />}
      <Text>
        {props.isShowInformation ? "Show information" : "Hide information"}
      </Text>
    </Button>
  );
};

const UserDetail = () => {
  const { userName } = useParams();
  const [isShowInformation, setIsShowInformation] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGearIconClick = (userName: string) => {
    navigate(`/admin/${userName}/settings`);
  };
  const handleBackIconClick = () => {
    navigate(`/admin`);
  };

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
            onClick={() => handleGearIconClick(userName)}
          >
            <img src="/assets/icon/gear.svg" />
          </Box>
        </Box>
        <Box display="flex" gap="4px" flexDirection="column">
          <Heading size="sm" color="#8080808C">
            Profile
          </Heading>
          <Heading size="sm">{userName}</Heading>
        </Box>
        <Banner size="sm" variant="error">
          Poor mood reported in the past 3 days
        </Banner>
        <Box>Mood history</Box>
        <Box display="flex" gap="4px">
          <Heading size="sm">Personal Information</Heading>
          <img height="18px" width="18px" src="/assets/icon/edit.svg" />
        </Box>
        <ToggleShowHidePersonalInformation
          isShowInformation={isShowInformation}
          setIsShowInformation={setIsShowInformation}
        />
      </Box>
    </Box>
  );
};

export default UserDetail;
