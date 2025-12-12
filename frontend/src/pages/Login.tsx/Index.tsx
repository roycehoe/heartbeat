import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import CaregiverLogInForm from "./CaregiverLoginForm";
import CaregiverSignupForm from "./CaregiverSignupForm";

export enum LogInFormState {
  CaregiverAuthenticate,
  CaregiverSignUp,
  CaregiverCreationSuccess,
  CaregiverOrCareReceipientSelection,
  CareReceipientSelection,
  CareReceipientSelectionAreYouSure,
}

const RenderForm = (props: {
  logInFormState: LogInFormState;
  setLogInFormState: React.Dispatch<React.SetStateAction<LogInFormState>>;
}) => {
  switch (props.logInFormState) {
    case LogInFormState.CaregiverAuthenticate:
      return <CaregiverLogInForm setLogInFormState={props.setLogInFormState} />;

    case LogInFormState.CaregiverSignUp:
      return (
        <CaregiverSignupForm setLogInFormState={props.setLogInFormState} />
      );

    case LogInFormState.CaregiverOrCareReceipientSelection:
      return <div>Select caregiver or care recipient</div>;

    case LogInFormState.CareReceipientSelection:
      return <div>Care recipient selection screen</div>;

    case LogInFormState.CareReceipientSelectionAreYouSure:
      return <div>Are you sure?</div>;

    default:
      return null;
  }
};

function LogIn() {
  const [logInFormState, setLogInFormState] = useState(
    LogInFormState.CaregiverAuthenticate
  );

  return (
    <Flex justifyContent="center" alignItems="center" height="100%">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        bg="white"
        height="100%"
        width="400px"
        p="32px"
        boxShadow="lg"
        borderRadius="8px"
        textAlign="center"
      >
        <Box mb="24px" gap="12px" display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <Image src="/assets/logo-circle-heartbeat.png"></Image>
          </Box>
          <Box>
            <Heading fontSize="2xl">HeartBeat</Heading>
            <Text fontSize="sm" color="slate.600">
              Press daily, stay connected
            </Text>
          </Box>
        </Box>
        <RenderForm
          logInFormState={logInFormState}
          setLogInFormState={setLogInFormState}
        ></RenderForm>
      </Box>
    </Flex>
  );
}

export default LogIn;
