import { Datagrid, List, TextField, ReferenceField, NumberField, SelectField } from "react-admin";

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="question" label="Target Language Sentence" />
        <TextField source="nativeText" label="Known Language Translation" />
        <SelectField
          source="type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
          ]}
        />
        <TextField source="speaker" label="Speaker" />
        <TextInput source="audioSrc" label="Audio URL (optional)"/>
        <TextField source="directAnswer" label="Direct Answer" />
        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};