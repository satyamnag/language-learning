import { SimpleForm, Edit, TextInput, required, SelectInput } from "react-admin";

const LANGUAGE_OPTIONS = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
];

export const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" validate={[required()]} label="Id" />
        <TextInput source="title" validate={[required()]} label="Target" />
        <SelectInput
          source="sourceLanguage"
          choices={LANGUAGE_OPTIONS}
          validate={[required()]}
          label="Source"
        />
      </SimpleForm>
    </Edit>
  );
};