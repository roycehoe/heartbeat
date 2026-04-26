import { Box, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostMagicLinkVerify } from "@/api/postMagicLinkVerify";

const MagicLinkVerify = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { mutate: verifyToken, isError } = usePostMagicLinkVerify();

  useEffect(() => {
    if (!token) return;
    verifyToken(
      { token },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.access_token);
          navigate("/");
        },
      }
    );
  }, []);

  if (isError) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={3} textAlign="center" px={6}>
          <Heading size="md">This link is no longer valid</Heading>
          <Text color="gray.600" fontSize="sm">
            Your caregiver may have issued a new link. Please use the latest link you received.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" color="blue.500" />
    </Box>
  );
};

export default MagicLinkVerify;
