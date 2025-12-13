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
import { getAdminLoginResponse } from "../../api/user";
import { LogInFormState } from "./Index";

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  // const { user } = useUser();
  // useEffect(() => {
  //   console.log("User has logged in!");
  //   setLogInFormState(LogInFormState.CaregiverSignUp);
  // }, [user]);

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
