import { FormControl, Link, Text } from "@chakra-ui/react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button, Input } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useGetAdminLoginRespose } from "../../api/user";
import { LogInFormState } from "./Index";

function isAdminAccountCreated(error: Error | null) {
  return error !== null;
}

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const { user } = useUser();
  const adminLoginResponse = useGetAdminLoginRespose(user);

  useEffect(() => {
    if (!user) {
      return setLogInFormState(LogInFormState.CaregiverAuthenticate);
    }

    if (!isAdminAccountCreated(adminLoginResponse.error)) {
      return setLogInFormState(LogInFormState.CaregiverSignUp);
    }
    if (!adminLoginResponse.data) {
      return setLogInFormState(LogInFormState.CaregiverSignUp);
    }

    localStorage.setItem("token", adminLoginResponse.data.access_token);
    setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection);
  }, [user]);

  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button>Start here</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

export default CaregiverLogInForm;
