import { Box, FormControl, Link, Text, useToast } from "@chakra-ui/react";
import { Button, Input } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSignUpAdminResponse } from "../../api/admin";
import { LogInFormState } from "./Index";

function CaregiverSignupForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCreatedAdminSuccessfully, sethasCreatedAdminSuccessfully] =
    useState(false);
  const toast = useToast();
  const { mutate } = useGetSignUpAdminResponse();

  async function handleLogInBtnClick() {
    if (username === "") {
      setErrorMessage("Please input your username");
      return;
    }
    if (password === "") {
      setErrorMessage("Please input your password");
      return;
    }
    if (confirmPassword === "") {
      setErrorMessage("Please input your confirm password");
      return;
    }
    if (name === "") {
      setErrorMessage("Please input your name");
      return;
    }
    if (contactNumber === "") {
      setErrorMessage("Please input your contactNumber");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password must be the same");
      return;
    }
    mutate(
      {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        name: name,
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          size="lg"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
      </FormControl>
      <FormControl id="admin-password" isRequired mb="16px">
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          size="lg"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
      </FormControl>
      <FormControl id="admin-password" isRequired mb="16px">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
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
          onClick={() =>
            setLogInFormState(LogInFormState.CaregiverAuthenticate)
          }
        >
          <Text>Go back</Text>
        </Button>
      </Box>
    </div>
  );
}

export default CaregiverSignupForm;
