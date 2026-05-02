import { Datagrid, List, TextField, SelectField } from "react-admin";

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