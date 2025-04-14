import { useEffect, useState } from "react";
import { CreateUserRequest } from "../../../api/admin";
import { DashboardResponse } from "../../../api/user";
import { FormFieldsViewUser } from "../../../components/FormFieldsViewUser";
import {
  VIEW_USER_FORM_FIELDS_PROPS,
} from "../constants";

export interface UpdateUserForm extends CreateUserRequest {}

function dashboardDataToUpdateUserFormData(
  dashboardData: DashboardResponse
): UpdateUserForm {
  return {
    username: dashboardData.username,
    contactNumber: dashboardData.contact_number,
    name: dashboardData.name,
    age: dashboardData.age,
    alias: dashboardData.alias,
    race: dashboardData.race,
    gender: dashboardData.gender,
    postalCode: dashboardData.postal_code,
    floor: dashboardData.floor,
  };
}

function ModalUpdateUser(props: { dashboardData: DashboardResponse }) {
  const [updateUserForm, setUpdateUserForm] = useState({} as UpdateUserForm);

  useEffect(() => {
    setUpdateUserForm(dashboardDataToUpdateUserFormData(props.dashboardData));
  }, []);

  return (
    <FormFieldsViewUser
      createUserForm={updateUserForm}
      setCreateUserForm={setUpdateUserForm}
      createUpdateUserFormFields={VIEW_USER_FORM_FIELDS_PROPS}
    />
  );
}

export default ModalUpdateUser;
