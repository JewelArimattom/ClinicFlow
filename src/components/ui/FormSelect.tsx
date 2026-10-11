import React, { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface FormSelectOption {
  value: string | number;
  label: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  options?: FormSelectOption[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      helperText,
      error,
      icon,
      options,
      children,
      id,
      name,
      required,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs sm:text-[13px] font-semibold text-[#182522] mb-1.5 tracking-tight">
            {label}
            {required && <span className="text-[#07877F] ml-1 font-bold" title="Required field">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5F6D68] flex items-center justify-center w-5 h-5">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            name={name}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            className={`w-full h-12 sm:h-[50px] bg-white border rounded-[11px] text-[14px] sm:text-[15px] text-[#182522] transition-colors duration-150 appearance-none cursor-pointer ${
              icon ? "pl-11" : "pl-4"
            } pr-10 ${
              error
                ? "border-[#B42318] focus:border-[#B42318] focus:outline-none focus:ring-3 focus:ring-[#B42318]/15"
                : "border-[#C8D2CE] hover:border-[#849B93] focus:border-[#07877F] focus:outline-none focus:ring-3 focus:ring-[#07877F]/15"
            } ${disabled ? "bg-[#FAF9F6] border-[#E5E9E5] text-[#5F6D68] cursor-not-allowed opacity-75" : ""} ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5F6D68]">
            <ChevronDown className="w-4 h-4" strokeWidth={1.8} />
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-[#B42318] mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="text-xs text-[#5F6D68] mt-1.5 leading-relaxed">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
