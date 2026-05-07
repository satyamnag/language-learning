import { SimpleForm, Create, TextInput, required, SelectInput } from "react-admin";

const LANGUAGE_OPTIONS = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
];

export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Target" />
        <SelectInput
          source="sourceLanguage"
          choices={LANGUAGE_OPTIONS}
          validate={[required()]}
          defaultValue="en"
          label="Source"
        />
      </SimpleForm>
    </Create>
  );
};