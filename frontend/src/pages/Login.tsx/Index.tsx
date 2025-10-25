import {
  Box,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@chakra-ui/react";
import { Link, Tabs } from "@opengovsg/design-system-react";
import { useState } from "react";
import CaregiverLogInForm from "./CaregiverLoginForm";
import CaregiverSignupForm from "./CaregiverSignupForm";
import UserLogInForm from "./UserLoginForm";

const DEFAULT_ROLES: string[] = ["user", "caregiver"];

function LogIn() {
  const [role, setRole] = useState("user");
  const [isSigningUpAsCaregiver, setIsSigningUpAsCaregiver] = useState(true);

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

        {isSigningUpAsCaregiver ? (
          <CaregiverSignupForm
            setIsSigningUpAsCaregiver={setIsSigningUpAsCaregiver}
          ></CaregiverSignupForm>
        ) : (
          <div>
            <Tabs
              onChange={(index) => {
                setRole(DEFAULT_ROLES[index]);
              }}
            >
              <TabList mb="16px">
                {DEFAULT_ROLES.map((role) => {
                  return <Tab>{role}</Tab>;
                })}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <UserLogInForm></UserLogInForm>
                </TabPanel>
                <TabPanel>
                  <CaregiverLogInForm
                    setIsSigningUpAsCaregiver={setIsSigningUpAsCaregiver}
                  ></CaregiverLogInForm>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Link mt="16px" display="block" fontSize="sm" color="blue.500">
              Forgot password?
            </Link>
          </div>
        )}
      </Box>
    </Flex>
  );
}

export default LogIn;
