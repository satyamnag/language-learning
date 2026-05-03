import { SimpleForm, Edit, TextInput, ReferenceInput, NumberInput, required, SelectInput } from "react-admin";

export const ChallengeEdit = () => {
  return (
    <Edit>
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
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
};