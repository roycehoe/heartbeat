import { Box, FormControl, Link, Text } from "@chakra-ui/react";
import { Button, Input } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminLoginResponse } from "../../api/user";

function CaregiverSignupForm({
  setIsSigningUpAsCaregiver,
}: {
  setIsSigningUpAsCaregiver: (isSigningUpAsCaregiver: boolean) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
        <Button width="100%" onClick={() => setIsSigningUpAsCaregiver(false)}>
          <Text>Go back</Text>
        </Button>
      </Box>
    </div>
  );
}

export default CaregiverSignupForm;
