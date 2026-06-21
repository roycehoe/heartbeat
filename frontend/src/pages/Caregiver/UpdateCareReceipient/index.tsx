import {
  Alert,
  AlertDescription,
  AlertIcon,
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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useGetCareReceipientUpdateResponse } from "@/api/getCareReceipientUpdateResponse";
import { CareReceipientCreateRequest, CareReceipientDetailOut } from "@/api/types";
import FormFieldsCareReceipientCreateUpdate from "@/components/FormFieldsCareReceipientCreateUpdate";
import { UPDATE_CARE_RECEIPIENT_FORM_FIELDS_PROPS } from "@/pages/Caregiver/constants";
import { getSubmitUpdateCareReceipientFormErrorMessage } from "@/pages/Caregiver/utils";

export interface UpdateCareReceipientForm extends CareReceipientCreateRequest {}

function dashboardDataToUpdateCareReceipientFormData(
  dashboardData: CareReceipientDetailOut
): UpdateCareReceipientForm {
  return {
    contactNumber: dashboardData.contact_number,
    name: dashboardData.name,
    age_range: dashboardData.age_range,
    race: dashboardData.race,
    gender: dashboardData.gender,
    appLanguage: dashboardData.app_language,
    postalCode: dashboardData.postal_code,
    floor: dashboardData.floor,
    unit: dashboardData.unit,
    block: dashboardData.block,
  };
}

function ModalUpdateCareReceipient(props: {
  isOpen: boolean;
  onClose: () => void;
  careReceipientId: string;
  dashboardData: CareReceipientDetailOut;
}) {
  const [updateCareReceipientForm, setUpdateCareReceipientForm] = useState<UpdateCareReceipientForm>(
    dashboardDataToUpdateCareReceipientFormData(props.dashboardData)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate, isPending } = useGetCareReceipientUpdateResponse();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    setErrorMessage(getSubmitUpdateCareReceipientFormErrorMessage(updateCareReceipientForm));
  }, [updateCareReceipientForm]);

  function handleSubmit() {
    mutate(
      { careReceipientId: Number(props.careReceipientId), request: updateCareReceipientForm },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getCareReceipientDetailResponse", Number(props.careReceipientId)],
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
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Personal Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap="16px">
          <FormFieldsCareReceipientCreateUpdate
            createCareReceipientForm={updateCareReceipientForm}
            setCreateCareReceipientForm={setUpdateCareReceipientForm}
            createUpdateCareReceipientFormFields={UPDATE_CARE_RECEIPIENT_FORM_FIELDS_PROPS}
          />
          {errorMessage && (
            <Alert status="error" variant="subtle" minH="52px">
              <AlertIcon flexShrink={0} />
              <AlertDescription sx={{ display: "block" }}>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isPending}
            isDisabled={!!errorMessage}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdateCareReceipient;
