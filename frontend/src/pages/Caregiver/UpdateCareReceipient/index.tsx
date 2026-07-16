import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useGetCareReceipientUpdateResponse } from "@/api/getCareReceipientUpdateResponse";
import type { CareReceipientDetailOut } from "@/api/types";
import FormFieldsCareReceipientCreateUpdate, {
  careReceipientFormSchema,
  toCareReceipientCreateRequest,
} from "@/components/FormFieldsCareReceipientCreateUpdate";
import type { CareReceipientFormValues } from "@/components/FormFieldsCareReceipientCreateUpdate";

function dashboardDataToFormValues(
  dashboardData: CareReceipientDetailOut
): CareReceipientFormValues {
  return {
    name: dashboardData.name,
    contactNumber: dashboardData.contact_number,
    age_range: dashboardData.age_range,
    race: dashboardData.race,
    gender: dashboardData.gender,
    appLanguage: dashboardData.app_language,
    postalCode: String(dashboardData.postal_code),
    floor: String(dashboardData.floor),
    block: dashboardData.block,
    unit: dashboardData.unit ?? "",
  };
}

function ModalUpdateCareReceipient(props: {
  isOpen: boolean;
  onClose: () => void;
  careReceipientId: string;
  dashboardData: CareReceipientDetailOut;
}) {
  const { mutate, isPending } = useGetCareReceipientUpdateResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  const form = useForm<CareReceipientFormValues>({
    resolver: zodResolver(careReceipientFormSchema),
    defaultValues: dashboardDataToFormValues(props.dashboardData),
  });

  const handleSubmit = form.handleSubmit((values) => {
    mutate(
      {
        careReceipientId: Number(props.careReceipientId),
        request: toCareReceipientCreateRequest(values),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["careReceipient", Number(props.careReceipientId)],
          });
          props.onClose();
          toast({
            title: "User updated",
            description: "User details have been updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        onError: () => {
          toast({
            title: "Update failed",
            description: "Something went wrong. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  });

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Personal Information</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <Box as="form" noValidate onSubmit={handleSubmit}>
            <ModalBody display="flex" flexDirection="column" gap="16px">
              <FormFieldsCareReceipientCreateUpdate isDisabled={isPending} />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={props.onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending}>
                Save
              </Button>
            </ModalFooter>
          </Box>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdateCareReceipient;
