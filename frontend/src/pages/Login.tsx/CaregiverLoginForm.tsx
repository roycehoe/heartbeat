import { FormControl, Link, Text } from "@chakra-ui/react";
import { Button, Input } from "@opengovsg/design-system-react";
import { useState } from "react";
import { getAdminLoginResponse } from "../../api/user";
import { LogInFormState } from "./Index";

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogInBtnClick = async () => {
    if (username === "") {
      setErrorMessage("Please input your username");
      return;
    }
    if (password === "") {
      setErrorMessage("Please input your password");
      return;
    }
    try {
      const response = await getAdminLoginResponse({
        username: username,
        password: password,
      });
      setErrorMessage(""); // Clear error message on success
      localStorage.setItem("token", response.access_token);
      setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection);
    } catch (error) {
      if (error?.response && error.response.status === 401) {
        setErrorMessage("Username or password incorrect. Please try again.");
        return;
      }
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

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

      <Link
        onClick={() => setLogInFormState(LogInFormState.CaregiverSignUp)}
        my="16px"
        display="block"
        fontSize="sm"
        color="blue.500"
      >
        Sign up
      </Link>

      <Button width="100%" onClick={handleLogInBtnClick}>
        <Text>Log In</Text>
      </Button>

      {errorMessage && (
        <Text color="red.500" mt="16px">
          {errorMessage}
        </Text>
      )}
    </div>
  );
}

export default CaregiverLogInForm;
