import { SimpleForm, Create, TextInput, required, SelectInput } from "react-admin";

const LANGUAGE_OPTIONS = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "te", name: "Telugu" },
  { id: "ta", name: "Tamil" },
  { id: "kn", name: "Kannada" },
  { id: "or", name: "Odia" },
  { id: "bn", name: "Bengali" },
];

export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Title" />
        <SelectInput
          source="sourceLanguage"
          choices={LANGUAGE_OPTIONS}
          validate={[required()]}
          defaultValue="en"
          label="Source Language (Native)"
        />
      </SimpleForm>
    </Create>
  );
};