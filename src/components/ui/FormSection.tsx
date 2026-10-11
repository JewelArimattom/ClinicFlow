import React from "react";

export interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  icon,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="pb-3 border-b border-[#E5E9E5]">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-7 h-7 rounded-lg bg-[#EAF4F0] text-[#07877F] flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <h2 className="text-base sm:text-[17px] font-bold text-[#182522] tracking-tight">
            {title}
          </h2>
        </div>
        {description && (
          <p className="text-xs sm:text-[13px] text-[#5F6D68] mt-1 leading-relaxed pl-0">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4 pt-1">{children}</div>
    </div>
  );
}
