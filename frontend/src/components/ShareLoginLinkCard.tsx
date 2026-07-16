import { CopyIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { usePostRevokeMagicLink } from "@/api/postRevokeMagicLink";

interface ShareLoginLinkCardProps {
  loginLink: string;
  name: string;
  careReceipientId: number;
}

const ShareLoginLinkCard = ({
  loginLink,
  name,
  careReceipientId,
}: ShareLoginLinkCardProps) => {
  const [isRevokeModalOpen, setIsRevokeModalOpen] = React.useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: revokeToken, isPending: isRevoking } = usePostRevokeMagicLink();

  if (!loginLink) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loginLink);
      toast({
        title: "Link copied to clipboard",
        description: `Share it with ${name} to let them log in`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy — please copy the link manually",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRevoke = () => {
    revokeToken(careReceipientId, {
      onSuccess: () => {
        setIsRevokeModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["careReceipient", careReceipientId, "loginUrl"],
        });
        toast({
          title: "Link revoked",
          description: "A new login link has been generated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          title: "Revoke failed",
          description: "Something went wrong. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <>
      <Card variant="outline" borderColor="blue.200" bg="blue.50">
        <CardBody>
          <VStack spacing={3} align="stretch">
            <HStack>
              <LinkIcon color="blue.500" />
              <Heading size="xs">{name}'s Login Link</Heading>
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
              aria-label={`Copy login link for ${name}`}
            >
              Copy link
            </Button>
            <Button
              width="100%"
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={() => setIsRevokeModalOpen(true)}
              aria-label={`Revoke login link for ${name}`}
            >
              Revoke link
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Modal
        isOpen={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Revoke login link?</ModalHeader>
          <ModalBody>
            <Text fontSize="sm" color="gray.700">
              This will invalidate {name}'s current link and generate a new
              one. Their old link will stop working until you share the new
              one with them.
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsRevokeModalOpen(false)}
              isDisabled={isRevoking}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={handleRevoke}
              isLoading={isRevoking}
            >
              Revoke &amp; generate new link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareLoginLinkCard;
