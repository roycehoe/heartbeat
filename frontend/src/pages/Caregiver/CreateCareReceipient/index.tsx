import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Heading,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useGetCareReceipientCreateResponse } from "@/api/getCareReceipientCreateResponse";
import { AgeRange, AppLanguage, Gender, Race } from "@/api/types";
import FormCheckboxTermsAndConditions from "@/components/FormCheckboxTermsAndConditions";
import FormFieldsCareReceipientCreateUpdate, {
  careReceipientFormSchema,
  toCareReceipientCreateRequest,
} from "@/components/FormFieldsCareReceipientCreateUpdate";
import { IconArrowLeft } from "@/components/IconArrowLeft";

const createCareReceipientFormSchema = careReceipientFormSchema
  .extend({
    hasAgreedToTermsAndConditions: z.boolean(),
  })
  .refine((values) => values.hasAgreedToTermsAndConditions, {
    message: "You must agree to the terms and conditions.",
    path: ["hasAgreedToTermsAndConditions"],
  });

export type CreateCareReceipientForm = z.infer<
  typeof createCareReceipientFormSchema
>;

const DEFAULT_CREATE_CARE_RECEIPIENT_FORM: CreateCareReceipientForm = {
  name: "",
  contactNumber: "",
  age_range: AgeRange.UNDER_45,
  race: Race.CHINESE,
  gender: Gender.MALE,
  appLanguage: AppLanguage.ENGLISH,
  postalCode: "",
  floor: "",
  block: "",
  unit: "",
  hasAgreedToTermsAndConditions: false,
};

function ModalCreateCareReceipient() {
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCreatedUserSuccessfully, setHasCreatedUserSuccessfully] =
    useState(false);
  const navigate = useNavigate();
  const { mutate, isPending } = useGetCareReceipientCreateResponse();

  const form = useForm<CreateCareReceipientForm>({
    resolver: zodResolver(createCareReceipientFormSchema),
    defaultValues: DEFAULT_CREATE_CARE_RECEIPIENT_FORM,
  });

  const handleCreateCareReceipient = form.handleSubmit((values) => {
    setErrorMessage("");
    mutate(toCareReceipientCreateRequest(values), {
      onSuccess: () => {
        form.reset();
        setHasCreatedUserSuccessfully(true);
        navigate(`/dashboard`);
      },
      onError: () =>
        setErrorMessage("Something went wrong. Please try again later."),
    });
  });

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Box
        className="page"
        margin="18px"
        paddingBottom="24px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Box display="flex" gap="8px" justifyContent="space-between">
          <IconButton
            onClick={() => navigate(`/dashboard`)}
            isRound={true}
            variant="solid"
            aria-label="Done"
            icon={<IconArrowLeft />}
          />

          <Box display="flex" justifyContent="center"></Box>
        </Box>
        <Box display="flex" gap="16px" flexDirection="column">
          <Heading size="sm">Welcome to HeartBeat</Heading>
          <Text size="sm">
            Set up an account for your loved one to keep tabs on their mental
            well-being
          </Text>
          <Link onClick={() => navigate(`/dashboard/about`)}>
            How does it work?
          </Link>
        </Box>

        <FormProvider {...form}>
          <Box
            as="form"
            noValidate
            onSubmit={handleCreateCareReceipient}
            display="flex"
            flexDirection="column"
            width="100%"
            gap="24px"
          >
            <FormFieldsCareReceipientCreateUpdate isDisabled={isPending} />
            <Controller
              name="hasAgreedToTermsAndConditions"
              control={form.control}
              render={({ field }) => (
                <FormCheckboxTermsAndConditions
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isPending}
                  isInvalid={!!form.formState.errors.hasAgreedToTermsAndConditions}
                  errorMessage={
                    form.formState.errors.hasAgreedToTermsAndConditions?.message
                  }
                />
              )}
            />
            <Alert status="error" variant="subtle" hidden={errorMessage === ""}>
              <AlertIcon />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button
              type="submit"
              mr="3px"
              variant={hasCreatedUserSuccessfully ? "solid" : "outline"}
              isLoading={isPending}
            >
              {hasCreatedUserSuccessfully ? "User created!" : "Create account"}
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default ModalCreateCareReceipient;
