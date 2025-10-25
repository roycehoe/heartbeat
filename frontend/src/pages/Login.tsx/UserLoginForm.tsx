import { FormControl, Text } from "@chakra-ui/react";
import { Button, Input } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLoginResponse } from "../../api/user";

function UserLogInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>
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
      {errorMessage && (
        <Text color="red.500" mt="16px">
          {errorMessage}
        </Text>
      )}
    </div>
  );
}

export default UserLogInForm;
