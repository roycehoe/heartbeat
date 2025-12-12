import { useEffect, useState } from "react";
import { CreateUserRequest } from "../../../api/admin";
import { DashboardResponse } from "../../../api/user";
import { FormFieldsViewUser } from "../../../components/FormFieldsViewUser";
import { VIEW_USER_FORM_FIELDS_PROPS } from "../constants";

export interface UpdateUserForm extends CreateUserRequest {}

function dashboardDataToUpdateUserFormData(
  dashboardData: DashboardResponse
): UpdateUserForm {
  return {
    contactNumber: dashboardData.contact_number,
    name: dashboardData.name,
    age: dashboardData.age,
    alias: dashboardData.alias,
    race: dashboardData.race,
    gender: dashboardData.gender,
    postalCode: dashboardData.postal_code,
    floor: dashboardData.floor,
    unit: dashboardData.unit,
    block: dashboardData.block,
  };
}

function ModalUpdateUser(props: {
  dashboardData: DashboardResponse;
  isShowPersonalInformation: boolean;
}) {
  const [updateUserForm, setUpdateUserForm] = useState({} as UpdateUserForm);

  useEffect(() => {
    setUpdateUserForm(dashboardDataToUpdateUserFormData(props.dashboardData));
  }, []);

  return (
    <FormFieldsViewUser
      createUserForm={updateUserForm}
      setCreateUserForm={setUpdateUserForm}
      createUpdateUserFormFields={VIEW_USER_FORM_FIELDS_PROPS}
      isShowPersonalInformation={props.isShowPersonalInformation}
    />
  );
}

export default ModalUpdateUser;
