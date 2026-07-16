import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { AgeRange, AppLanguage, Gender, Race } from "@/api/types";
import type { CareReceipientCreateRequest } from "@/api/types";

export const careReceipientFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  contactNumber: z
    .string()
    .min(1, "Contact number is required.")
    .regex(/^\d{8}$/, "Contact number must contain exactly eight digits."),
  age_range: z.nativeEnum(AgeRange),
  race: z.nativeEnum(Race),
  gender: z.nativeEnum(Gender),
  appLanguage: z.nativeEnum(AppLanguage),
  postalCode: z
    .string()
    .min(1, "Postal code is required.")
    .regex(/^\d{6}$/, "Postal code must be 6 digits."),
  floor: z
    .string()
    .min(1, "Floor is required.")
    .regex(/^\d+$/, "Floor must be a number."),
  block: z.string().min(1, "Block is required."),
  unit: z.string().optional(),
});

export type CareReceipientFormValues = z.infer<typeof careReceipientFormSchema>;

export function toCareReceipientCreateRequest(
  values: CareReceipientFormValues
): CareReceipientCreateRequest {
  return {
    name: values.name,
    contactNumber: values.contactNumber,
    age_range: values.age_range,
    race: values.race,
    gender: values.gender,
    appLanguage: values.appLanguage,
    postalCode: Number(values.postalCode),
    floor: Number(values.floor),
    block: values.block,
    unit: values.unit || undefined,
  };
}

const AGE_RANGE_OPTIONS = [
  AgeRange.UNDER_45,
  AgeRange.R45_54,
  AgeRange.R55_64,
  AgeRange.R65_74,
  AgeRange.R75_84,
  AgeRange.R85_PLUS,
];
const RACE_OPTIONS = [Race.CHINESE, Race.INDIAN, Race.MALAY, Race.OTHERS];
const GENDER_OPTIONS = [Gender.MALE, Gender.FEMALE];
const APP_LANGUAGE_OPTIONS = [
  AppLanguage.ENGLISH,
  AppLanguage.CHINESE,
  AppLanguage.MALAY,
  AppLanguage.TAMIL,
];

function FormFieldsCareReceipientCreateUpdate(props: { isDisabled: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CareReceipientFormValues>();
  const { isDisabled } = props;

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      <FormControl isRequired isInvalid={!!errors.name} isDisabled={isDisabled}>
        <FormLabel>Name</FormLabel>
        <Input
          {...register("name")}
          placeholder="Lin Junjie"
          size="xs"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors.contactNumber}
        isDisabled={isDisabled}
      >
        <FormLabel>Contact Number</FormLabel>
        <Input
          type="tel"
          {...register("contactNumber")}
          placeholder="91234567"
          size="xs"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <FormErrorMessage>{errors.contactNumber?.message}</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors.age_range}
        isDisabled={isDisabled}
      >
        <FormLabel>Age Range</FormLabel>
        <Select {...register("age_range")} variant="outline">
          {AGE_RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.age_range?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.race} isDisabled={isDisabled}>
        <FormLabel>Race</FormLabel>
        <Select {...register("race")} variant="outline">
          {RACE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.race?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.gender} isDisabled={isDisabled}>
        <FormLabel>Gender</FormLabel>
        <Select {...register("gender")} variant="outline">
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors.appLanguage}
        isDisabled={isDisabled}
      >
        <FormLabel>Application Language</FormLabel>
        <Select {...register("appLanguage")} variant="outline">
          {APP_LANGUAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.appLanguage?.message}</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors.postalCode}
        isDisabled={isDisabled}
      >
        <FormLabel>Postal Code</FormLabel>
        <Input
          {...register("postalCode")}
          placeholder="189554"
          size="xs"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <FormErrorMessage>{errors.postalCode?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.floor} isDisabled={isDisabled}>
        <FormLabel>Floor</FormLabel>
        <Input
          {...register("floor")}
          placeholder="4"
          size="xs"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <FormErrorMessage>{errors.floor?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.block} isDisabled={isDisabled}>
        <FormLabel>Block</FormLabel>
        <Input
          {...register("block")}
          placeholder="123B"
          size="xs"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <FormErrorMessage>{errors.block?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.unit} isDisabled={isDisabled}>
        <FormLabel>Unit</FormLabel>
        <Input
          {...register("unit")}
          placeholder="#04-08"
          size="xs"
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <FormErrorMessage>{errors.unit?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}

export default FormFieldsCareReceipientCreateUpdate;
