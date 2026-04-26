import { Spinner } from "@chakra-ui/react";
import { SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCaregiverLoginResponse } from "../../api/getCaregiverLoginResponse";

function CaregiverLogInForm() {
  const { mutate, isPending } = useGetCaregiverLoginResponse();
  const { getToken, isSignedIn, userId: clerkUserId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn || isPending) return;

    const triggerLogin = async () => {
      const token = await getToken();
      if (!token) return;
      localStorage.setItem("clerk_token", token);
      mutate(undefined, {
        onSuccess: (loginData) => {
          localStorage.setItem("token", loginData.access_token);
          navigate("/dashboard");
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
    <SignedOut>
      <SignInButton>
        <Button>Start here</Button>
      </SignInButton>
    </SignedOut>
  );
}

export default CaregiverLogInForm;
