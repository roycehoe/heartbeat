import { Button, CheckboxGroup, SimpleGrid } from "@chakra-ui/react";
import {
  Checkbox,
  FormLabel,
  Input,
  SingleSelect,
} from "@opengovsg/design-system-react";
import React from "react";

interface DropdownMenuOption {
  label: any;
  value: any;
}

interface DropdownMenuProps {
  options: DropdownMenuOption[];
  header: string;
  menuState: any;
  setMenuState: React.Dispatch<React.SetStateAction<any>>;
}

const DEFAULT_DOSAGE_PER_ADMINISTRATION_PROPS = {
  options: [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ],
  header: "Dosage per administration",
};

const DEFAULT_DOSAGE_FREQUENCY_PROPS = {
  options: [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ],
  header: "Dosage frequency",
};

const DEFAULT_TIMES_PER_DOSAGE_FREQUENCY_PROPS = {
  options: [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ],
  header: "Times per dosage frequency",
};

const DEFAULT_DOSAGE_INSTRUCTIONS = {
  options: [
    { label: "Before food", value: "Before food" },
    { label: "After food", value: "After food" },
    { label: "At night", value: "At night" },
    { label: "In the morning", value: "In the morning" },
  ],
  header: "Dosage instructions",
};

const FormDropdown = (props: DropdownMenuProps) => {
  return (
    <>
      <FormLabel isRequired>{props.header}</FormLabel>
      <SingleSelect
        items={props.options}
        onChange={(e) => props.setMenuState(e)}
        value={props.menuState}
        name={props.header}
      ></SingleSelect>
    </>
  );
};

const CalendarForm = ({
  useCalendarFormHook: useCalendarFormHook,
  setIsShowQRCodeResult: setIsShowQRCodeResult,
}) => {
  const {
    calendarForm,
    updatePatientName,
    updateMedicationName,
    updateTotalDosesPrescribed,
    updateDosageCount,
    updateDosageFrequency,
    updateAdditionalDosageFrequency,
    updateDosageInstructions,
    submitCalendarForm,
  } = useCalendarFormHook;

  const handleGenerateQRCode = () => {
    submitCalendarForm();
    setIsShowQRCodeResult(true);
  };

  return (
    <SimpleGrid
      columns={2}
      spacing={8}
      templateColumns="max-content auto"
      alignItems="center"
    >
      <FormLabel isRequired>Name of patient</FormLabel>
      <Input
        value={calendarForm.patientName}
        onChange={(e) => updatePatientName(e.target.value)}
      ></Input>
      <FormLabel isRequired>Total doses dispatched</FormLabel>
      <Input
        value={calendarForm.totalDosesPrescribed}
        onChange={(e) => updateTotalDosesPrescribed(e.target.value)}
      ></Input>
      <FormLabel isRequired>Name of medication</FormLabel>
      <Input
        value={calendarForm.medicationName}
        onChange={(e) => updateMedicationName(e.target.value)}
      ></Input>
      <FormDropdown
        options={DEFAULT_DOSAGE_PER_ADMINISTRATION_PROPS.options}
        header={DEFAULT_DOSAGE_PER_ADMINISTRATION_PROPS.header}
        menuState={calendarForm.dosageCount}
        setMenuState={updateDosageCount}
      ></FormDropdown>
      <FormDropdown
        options={DEFAULT_DOSAGE_FREQUENCY_PROPS.options}
        header={DEFAULT_DOSAGE_FREQUENCY_PROPS.header}
        menuState={calendarForm.additionalDosageFrequency}
        setMenuState={updateAdditionalDosageFrequency}
      ></FormDropdown>
      <FormDropdown
        options={DEFAULT_TIMES_PER_DOSAGE_FREQUENCY_PROPS.options}
        header={DEFAULT_TIMES_PER_DOSAGE_FREQUENCY_PROPS.header}
        menuState={calendarForm.dosageFrequency}
        setMenuState={updateDosageFrequency}
      ></FormDropdown>
      <FormLabel isRequired>Dosage instructions</FormLabel>
      <CheckboxGroup>
        <div>
          {DEFAULT_DOSAGE_INSTRUCTIONS.options.map((instruction) => (
            <Checkbox
              key={instruction.value}
              value={instruction.value}
              {...updateDosageInstructions(instruction.value)}
            >
              {instruction.label}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>
      <Button variant="outline" onClick={handleGenerateQRCode}>
        Generate QR Code
      </Button>
    </SimpleGrid>
  );
};

export default CalendarForm;
