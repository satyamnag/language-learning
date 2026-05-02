import { SimpleForm, Edit, TextInput, ReferenceInput, NumberInput, required } from "react-admin";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  or: "Odia",
  bn: "Bengali",
};

export const UnitEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput 
          source="id" 
          validate={[required()]} 
          label="Id"
        />
        <TextInput 
          source="title" 
          validate={[required()]} 
          label="Title"
        />
        <TextInput 
          source="description" 
          validate={[required()]} 
          label="Description"
        />
        <ReferenceInput
          source="courseId"
          reference="courses"
          optionText={(record: any) => `${record.title} (${LANGUAGE_NAMES[record.sourceLanguage] || record.sourceLanguage})`}
        />
        <NumberInput
          source="order"
          validate={[required()]}
          label="Order"
        />
      </SimpleForm>
    </Edit>
  );
};