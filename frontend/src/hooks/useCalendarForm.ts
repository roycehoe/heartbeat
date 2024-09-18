import { useCheckboxGroup } from "@chakra-ui/react";
import { useState } from "react";

interface CalendarForm {
  patientName: string;
  medicationName: string;
  totalDosesPrescribed: string;

  dosageCount: number;
  dosageFrequency: number;
  additionalDosageFrequency: string;

  dosageInstructions: string[];
}

const DEFAULT_CALENDAR_FORM = {
  patientName: "",
  medicationName: "",
  totalDosesPrescribed: "",

  dosageCount: 1,
  dosageFrequency: 1,
  additionalDosageFrequency: "daily",
  dosageInstructions: [],
};

const useCalendarForm = () => {
  const [calendarForm, setCalendarForm] = useState<CalendarForm>({
    ...DEFAULT_CALENDAR_FORM,
  });
  const { getCheckboxProps } = useCheckboxGroup({
    value: calendarForm.dosageInstructions,
  });

  const updateCalendarForm = (calendarForm: CalendarForm) => {
    setCalendarForm((prevForm) => ({
      ...prevForm,
      ...calendarForm,
    }));
  };

  const resetCalendarForm = () => {
    setCalendarForm((prevForm) => ({
      ...prevForm,
      ...DEFAULT_CALENDAR_FORM,
    }));
  };

  const submitCalendarForm = () => {
    console.log("Hit some API endpont and change some state!");
  };

  const updatePatientName = (name: string) => {
    setCalendarForm((prevForm) => ({ ...prevForm, patientName: name }));
  };

  const updateMedicationName = (name: string) => {
    setCalendarForm((prevForm) => ({ ...prevForm, medicationName: name }));
  };

  const updateTotalDosesPrescribed = (doses: string) => {
    setCalendarForm((prevForm) => ({
      ...prevForm,
      totalDosesPrescribed: doses,
    }));
  };

  const updateDosageCount = (count: number) => {
    setCalendarForm((prevForm) => ({ ...prevForm, dosageCount: count }));
  };

  const updateDosageFrequency = (frequency: number) => {
    setCalendarForm((prevForm) => ({
      ...prevForm,
      dosageFrequency: frequency,
    }));
  };

  const updateAdditionalDosageFrequency = (frequency: string) => {
    setCalendarForm((prevForm) => ({
      ...prevForm,
      additionalDosageFrequency: frequency,
    }));
  };

  const updateDosageInstructions = (dosageInstruction: string) => {
    return { ...getCheckboxProps({ value: dosageInstruction }) };
  };

  return {
    calendarForm,
    updateCalendarForm,
    submitCalendarForm,
    resetCalendarForm,

    updatePatientName,
    updateMedicationName,
    updateTotalDosesPrescribed,
    updateDosageCount,
    updateDosageFrequency,
    updateAdditionalDosageFrequency,
    updateDosageInstructions,
  };
};

export default useCalendarForm;
