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

// Format: "source → target" (e.g., "English → Hindi")
const formatCourseLabel = (record: any) => {
  if (!record) return "";
  const sourceLang = record.sourceLanguage;
  const sourceName = sourceLang ? (LANGUAGE_NAMES[sourceLang] || sourceLang) : "";
  return sourceName ? `${sourceName} → ${record.title}` : record.title;
};

export const UnitEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput source="id" validate={[required()]} label="Id" />
        <TextInput source="title" validate={[required()]} label="Title" />
        <TextInput source="description" validate={[required()]} label="Description" />
        <ReferenceInput
          source="courseId"
          reference="courses"
          optionText={formatCourseLabel}
        />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
};