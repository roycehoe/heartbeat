import { Box, Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";
import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import CaregiverLogInForm from "./CaregiverLoginForm";

function LogIn() {
  return (
    <>
      <ClerkLoading>
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Spinner />
        </Flex>
      </ClerkLoading>
      <ClerkLoaded>
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
                <Image
                  src="/assets/logo-circle-heartbeat.png"
                  boxSize="32px"
                />
              </Box>
              <Box>
                <Heading fontSize="2xl">HeartBeat</Heading>
                <Text fontSize="sm" color="slate.600">
                  Press daily, stay connected
                </Text>
              </Box>
            </Box>
            <CaregiverLogInForm />
          </Box>
        </Flex>
      </ClerkLoaded>
    </>
  );
}

export default LogIn;
