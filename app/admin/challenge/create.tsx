import { SimpleForm, Create, TextInput, ReferenceInput, NumberInput, required, SelectInput } from "react-admin";

export const ChallengeCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput 
          source="question" 
          validate={[required()]} 
          label="Target Language Sentence (e.g., Tamil)"
        />
        <TextInput 
          source="nativeText" 
          validate={[required()]} 
          label="Known Language Translation (e.g., English)"
        />
        <SelectInput
          source="type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
          ]}
          validate={[required()]} 
        />
        <TextInput
          source="speaker"
          label="Speaker name (e.g., Riya, Aarav, Priya, etc.)"
        />
        <TextInput
          source="directAnswer"
          label="Direct answer (optional) – if set, challenge options are ignored"
        />
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  );
};