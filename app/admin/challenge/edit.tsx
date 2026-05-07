import { SimpleForm, Edit, TextInput, ReferenceInput, NumberInput, required } from "react-admin";

export const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput 
          source="question" 
          validate={[required()]} 
          label="Roman Sentence"
        />
        <TextInput 
          source="nativeText" 
          validate={[required()]} 
          label="Source Language Translation"
        />
        <TextInput
          source="speaker"
          label="Speaker Name"
        />
        <TextInput
          source="audioSrc"
          label="Audio URL"
        />
        <TextInput
          source="directAnswer"
          label="Target Language Sentence"
        />
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
};