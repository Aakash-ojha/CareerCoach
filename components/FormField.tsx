import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Field>
            <FieldLabel className="text-light-100!  font-normal!">
              {label}
            </FieldLabel>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="input"
            />
          </Field>
        );
      }}
    />
  );
};

export default FormField;
