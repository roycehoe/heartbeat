import { Box, FormControl, Text, useToast } from "@chakra-ui/react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { Button, Input } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useGetSignUpAdminResponse } from "../../api/admin";
import { useGetAdminLoginRespose } from "../../api/user";
import { LogInFormState } from "./Index";

function CaregiverSignupForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCreatedAdminSuccessfully, sethasCreatedAdminSuccessfully] =
    useState(false);
  const toast = useToast();
  const { mutate } = useGetSignUpAdminResponse();
  const {
    refetch: refetchGetAdminLoginResponse,
    data: adminLoginResponseData,
  } = useGetAdminLoginRespose(user);
  const { signOut } = useClerk();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLogInFormState(LogInFormState.CaregiverAuthenticate);
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clerk_token");
    signOut({ redirectUrl: "/login" });
  };

  async function handleLogInBtnClick() {
    if (username === "") {
      setErrorMessage("Please input your username");
      return;
    }
    if (contactNumber === "") {
      setErrorMessage("Please input your contactNumber");
      return;
    }
    if (!user?.id) {
      return;
    }
    mutate(
      {
        clerk_id: user?.id,
        username: username,
        contactNumber: Number(contactNumber),
      },
      {
        onSuccess: () => {
          setErrorMessage("");
          toast({
            title: "Account created",
            description: "Your account has been created successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setLogInFormState(LogInFormState.CaregiverCreationSuccess);
          refetchGetAdminLoginResponse();
          localStorage.setItem("token", adminLoginResponseData.access_token);
          setLogInFormState(LogInFormState.CaregiverCreationSuccess);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            return setErrorMessage("This username has already been taken");
          }
          setErrorMessage("Something went wrong. Please try again later.");
        },
      }
    );
  }

  if (hasCreatedAdminSuccessfully) {
    return (
      <Box display="flex" flexDirection="column" gap="12px">
        <Text fontWeight="600" fontSize="18px">
          Account created!
        </Text>
        <Button
          width="100%"
          onClick={() => {
            setLogInFormState(LogInFormState.CaregiverAuthenticate);
            sethasCreatedAdminSuccessfully(false);
          }}
        >
          <Text>Go back</Text>
        </Button>
      </Box>
    );
  }

  return (
    <div>
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
      <FormControl isRequired mb="16px">
        <Input
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Contact Number"
          size="lg"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
      </FormControl>
      <Box display="flex" flexDirection="column" gap="12px">
        {errorMessage && (
          <Text color="red.500" mt="16px">
            {errorMessage}
          </Text>
        )}
        <Button width="100%" onClick={handleLogInBtnClick}>
          <Text>Create Account</Text>
        </Button>
        <Button
          width="100%"
          onClick={() => {
            setLogInFormState(LogInFormState.CaregiverAuthenticate);
            logoutUser();
          }}
        >
          <Text>Go back</Text>
        </Button>
      </Box>
    </div>
  );
}

export default CaregiverSignupForm;
