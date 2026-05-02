import { Datagrid, List, TextField, SelectField } from "react-admin";

const LANGUAGE_OPTIONS = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "te", name: "Telugu" },
  { id: "ta", name: "Tamil" },
  { id: "kn", name: "Kannada" },
  { id: "or", name: "Odia" },
  { id: "bn", name: "Bengali" },
];

export const CourseList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="imageSrc" />
        <SelectField
          source="sourceLanguage"
          choices={LANGUAGE_OPTIONS}
          label="Source"
        />
      </Datagrid>
    </List>
  );
};