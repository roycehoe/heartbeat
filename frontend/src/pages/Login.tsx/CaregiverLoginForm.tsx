import { Spinner } from "@chakra-ui/react";
import { SignedOut, SignInButton, useClerk, useUser } from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect } from "react";
import { useGetAdminLoginRespose } from "../../api/user";
import { LogInFormState } from "./Index";

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const { user } = useUser();
  const { data, error, isLoading, isFetching } = useGetAdminLoginRespose(user);

  useEffect(() => {
    if (!user) {
      setLogInFormState(LogInFormState.CaregiverAuthenticate);
      return;
    }
    if (error) {
      return setLogInFormState(LogInFormState.CaregiverSignUp);
    }
    if (isLoading || isFetching) {
      return;
    }

    if (!data) {
      setLogInFormState(LogInFormState.CaregiverSignUp);
      return;
    }

    localStorage.setItem("token", data.access_token);
    setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection);
  }, [user, data, error, isLoading, isFetching, setLogInFormState]);

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
