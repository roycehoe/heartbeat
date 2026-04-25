import { Spinner } from "@chakra-ui/react";
import { SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect } from "react";
import { useGetAdminLoginResponse } from "../../api/getAdminLoginResponse";
import { LogInFormState } from "./Index";

function CaregiverLogInForm({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const { mutate, isPending } = useGetAdminLoginResponse();
  const { getToken, isSignedIn, userId: clerkUserId } = useAuth();

  useEffect(() => {
    if (!isSignedIn || isPending) return;

    const triggerLogin = async () => {
      const token = await getToken();
      if (!token) return;
      localStorage.setItem("clerk_token", token);
      mutate(undefined, {
        onSuccess: (loginData) => {
          localStorage.setItem("token", loginData.access_token);
          setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection);
        },
        onError: () => {
          window.open(
            `https://my.carecompass.sg/onboarding?id=${clerkUserId}`,
            "_self"
          );
        },
      });
    };

    triggerLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  if (isPending) {
    return <Spinner />;
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
