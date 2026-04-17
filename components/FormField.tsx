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
  autoComplete: string;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
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
              autoComplete={autoComplete}
            />

            {error && (
              <p className="text-red-500 text-xs mt-1 px-5">{error.message}</p>
            )}
          </Field>
        );
      }}
    />
  );
};

export default FormField;
