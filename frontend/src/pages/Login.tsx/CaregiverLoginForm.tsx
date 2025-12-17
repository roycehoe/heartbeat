import { Spinner } from "@chakra-ui/react";
import { SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect } from "react";
import { useGetAdminLoginRespose } from "../../api/user";
import { LogInFormState } from "./Index";

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const { data, error, isLoading, isFetching, refetch } =
    useGetAdminLoginRespose();
  const { getToken, isSignedIn, userId: clerkUserId } = useAuth();

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
      window.open(
        `https://my.carecompass.sg/onboarding?id=${clerkUserId}`,
        "_self"
      );
      return;
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
