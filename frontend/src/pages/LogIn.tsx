import {
  Box,
  Flex,
  FormControl,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@chakra-ui/react";
import { Button, Input, Link, Tabs } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminLoginResponse, getUserLoginResponse } from "../api/user";

const DEFAULT_ROLES: string[] = ["user", "admin"];

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Track the role being used for login
  const [errorMessage, setErrorMessage] = useState(""); // State to track the error message
  const navigate = useNavigate();

  const handleLogInBtnClick = async () => {
    if (username === "") {
      setErrorMessage("Please input your username");
      return;
    }
    if (password === "") {
      setErrorMessage("Please input your password");
      return;
    }
    if (role === "user") {
      try {
        const response = await getUserLoginResponse({
          username: username,
          password: password,
        });
        setErrorMessage(""); // Clear error message on success
        localStorage.setItem("token", response.access_token);
        navigate("/");
      } catch (error) {
        if (error?.response && error.response.status === 400) {
          setErrorMessage("Username or password incorrect. Please try again.");
          return;
        }
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
    if (role === "admin") {
      try {
        const response = await getAdminLoginResponse({
          username: username,
          password: password,
        });
        setErrorMessage(""); // Clear error message on success
        localStorage.setItem("token", response.access_token);
        navigate("/admin");
      } catch (error) {
        if (error?.response && error.response.status === 400) {
          setErrorMessage("Username or password incorrect. Please try again.");
          return;
        }
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

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
            <Image src="public/bfg.png"></Image>
          </Box>
          <Box>
            <Heading fontSize="2xl">HeartBeat</Heading>
            <Text fontSize="sm" color="slate.600">
              Press daily, stay connected
            </Text>
          </Box>
        </Box>

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
              <FormControl id="username" isRequired mb="16px">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  size="lg"
                  borderColor="slate.300"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              <FormControl id="password" isRequired mb="16px">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  size="lg"
                  borderColor="slate.300"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              <Button width="100%" onClick={handleLogInBtnClick}>
                <Text>Log In</Text>
              </Button>
            </TabPanel>
            <TabPanel>
              <FormControl id="admin-username" isRequired mb="16px">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  size="lg"
                  borderColor="slate.300"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              <FormControl id="admin-password" isRequired mb="16px">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  size="lg"
                  borderColor="slate.300"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              <Button width="100%" onClick={handleLogInBtnClick}>
                <Text>
                  Log In as {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {errorMessage && (
          <Text color="red.500" mt="16px">
            {errorMessage}
          </Text>
        )}

        <Link mt="16px" display="block" fontSize="sm" color="blue.500">
          Forgot password?
        </Link>
      </Box>
    </Flex>
  );
}

export default LogIn;
