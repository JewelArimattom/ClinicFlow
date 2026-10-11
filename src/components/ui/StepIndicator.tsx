import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  className = "",
}: StepIndicatorProps) {
  return (
    <nav aria-label="Registration Progress" className={`w-full ${className}`}>
      <ol className="flex items-center justify-between w-full relative">
        {steps.map((s, idx) => {
          const isCompleted = currentStep > s.id;
          const isCurrent = currentStep === s.id;
          const isFuture = currentStep < s.id;

          return (
            <li
              key={s.id}
              className="relative flex-1 flex flex-col items-center group"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Connector line between steps (desktop & tablet) */}
              {idx < steps.length - 1 && (
                <div
                  className="absolute top-4 sm:top-4.5 left-1/2 w-full h-[2px] -z-0 transition-colors duration-300"
                  style={{
                    backgroundColor: isCompleted ? "#07877F" : "#E5E9E5",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Step circle */}
              <button
                type="button"
                disabled={!isCompleted || !onStepClick}
                onClick={() => isCompleted && onStepClick && onStepClick(s.id)}
                className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                  isCompleted
                    ? "bg-[#07877F] text-white shadow-sm ring-4 ring-[#EAF4F0]"
                    : isCurrent
                    ? "bg-[#07877F] text-white ring-4 ring-[#EAF4F0] shadow-sm font-extrabold"
                    : "bg-white border-2 border-[#C8D2CE] text-[#5F6D68]"
                } ${
                  isCompleted && onStepClick
                    ? "cursor-pointer hover:bg-[#066E68]"
                    : "cursor-default"
                }`}
                aria-label={`Step ${s.id}: ${s.label} (${
                  isCompleted ? "Completed" : isCurrent ? "Current" : "Upcoming"
                })`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  <span>{s.id}</span>
                )}
              </button>

              {/* Step Label */}
              <div className="text-center mt-2 px-1">
                <span
                  className={`block text-[12px] sm:text-[13px] font-semibold tracking-tight transition-colors ${
                    isCurrent
                      ? "text-[#07877F] font-bold"
                      : isCompleted
                      ? "text-[#182522]"
                      : "text-[#5F6D68]"
                  }`}
                >
                  {s.label}
                </span>
                {s.description && (
                  <span className="hidden sm:block text-[11px] text-[#5F6D68] mt-0.5">
                    {s.description}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
