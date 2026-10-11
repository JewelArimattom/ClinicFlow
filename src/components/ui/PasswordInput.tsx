"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  showIcon?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Password",
      helperText,
      error,
      showIcon = true,
      id,
      name = "password",
      required,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name || "password-input";

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs sm:text-[13px] font-semibold text-[#182522] mb-1.5 tracking-tight">
            {label}
            {required && <span className="text-[#07877F] ml-1 font-bold" title="Required field">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {showIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5F6D68] flex items-center justify-center w-5 h-5">
              <Lock className="w-4 h-4" strokeWidth={1.8} />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? "text" : "password"}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`w-full h-12 sm:h-[50px] bg-white border rounded-[11px] text-[14px] sm:text-[15px] text-[#182522] placeholder:text-[#5F6D68]/60 transition-colors duration-150 ${
              showIcon ? "pl-11" : "pl-4"
            } pr-12 ${
              error
                ? "border-[#B42318] focus:border-[#B42318] focus:outline-none focus:ring-3 focus:ring-[#B42318]/15"
                : "border-[#C8D2CE] hover:border-[#849B93] focus:border-[#07877F] focus:outline-none focus:ring-3 focus:ring-[#07877F]/15"
            } ${disabled ? "bg-[#FAF9F6] border-[#E5E9E5] text-[#5F6D68] cursor-not-allowed opacity-75" : ""} ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#5F6D68] hover:text-[#182522] hover:bg-[#EAF4F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" strokeWidth={1.8} />
            ) : (
              <Eye className="w-4 h-4" strokeWidth={1.8} />
            )}
          </button>
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-[#B42318] mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#5F6D68] mt-1.5 leading-relaxed">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
