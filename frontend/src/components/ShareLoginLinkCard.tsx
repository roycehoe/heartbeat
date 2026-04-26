import { CopyIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";

interface ShareLoginLinkCardProps {
  loginLink: string;
  alias: string;
}

const ShareLoginLinkCard = ({ loginLink, alias }: ShareLoginLinkCardProps) => {
  const toast = useToast();

  if (!loginLink) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loginLink);
      toast({
        title: "Link copied to clipboard",
        description: `Share it with ${alias} to let them log in`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Clipboard write failed", err);
      toast({
        title: "Copy failed",
        description: "Could not copy — please copy the link manually",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Card variant="outline" borderColor="blue.200" bg="blue.50">
      <CardBody>
        <VStack spacing={3} align="stretch">
          <HStack>
            <LinkIcon color="blue.500" />
            <Heading size="xs">{alias}'s Login Link</Heading>
          </HStack>
          <Box
            bg="white"
            border="1px solid"
            borderColor="blue.200"
            borderRadius="md"
            p={2}
            fontFamily="mono"
            fontSize="sm"
            color="gray.700"
            wordBreak="break-all"
          >
            {loginLink}
          </Box>
          <Button
            width="100%"
            size="sm"
            colorScheme="blue"
            leftIcon={<CopyIcon />}
            onClick={handleCopy}
            aria-label={`Copy login link for ${alias}`}
          >
            Copy link
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ShareLoginLinkCard;
