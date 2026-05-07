import { Datagrid, List, TextField, ReferenceField, NumberField } from "react-admin";

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" label="Roman Sentence" />
        <TextField source="nativeText" label="Source Language Translation" />
        <TextField source="speaker" label="Speaker Name" />
        <TextField source="audioSrc" label="Audio URL" />
        <TextField source="directAnswer" label="Target Language Sentence" />
        <ReferenceField source="lessonId" reference="lessons" label="Lesson" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};