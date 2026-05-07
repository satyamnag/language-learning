import { Datagrid, List, TextField, SelectField } from "react-admin";

const LANGUAGE_OPTIONS = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
];

export const CourseList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" label="Target" />
        <SelectField
          source="sourceLanguage"
          choices={LANGUAGE_OPTIONS}
          label="Source"
        />
      </Datagrid>
    </List>
  );
};