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
        <SelectInput
          source="speaker"
          choices={[
            { id: "riya", name: "Riya" },
            { id: "aarav", name: "Aarav" },
          ]}
          label="Speaker"
        />
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  );
};