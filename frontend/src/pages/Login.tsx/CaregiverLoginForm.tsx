import { Spinner } from "@chakra-ui/react";
import {
  SignedOut,
  SignInButton,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useGetAdminLoginRespose } from "../../api/user";
import { LogInFormState } from "./Index";

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const { data, error, isLoading, isFetching, refetch } =
    useGetAdminLoginRespose();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const getSetClerkToken = async () => {
      const token = await getToken();
      token && localStorage.setItem("clerk_token", token);
    };

    if (!isSignedIn) {
      return;
    }
    if (isLoading || isFetching) {
      return;
    }

    getSetClerkToken();
    refetch();

    if (data) {
      localStorage.setItem("token", data.access_token);
      setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection);
    }

    if (error) {
      return setLogInFormState(LogInFormState.CaregiverSignUp);
    }
  }, [isSignedIn, data, error, isLoading, isFetching, setLogInFormState]);

  if (isLoading || isFetching) {
    <Spinner></Spinner>;
  }

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
