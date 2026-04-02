import React, { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon: Icon,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === "left" && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30 transition-colors duration-200 ${
              Icon && iconPosition === "left" ? "pl-10" : ""
            } ${
              Icon && iconPosition === "right" ? "pr-10" : ""
            } ${error ? "border-destructive" : ""} ${className}`}
            {...props}
          />
          {Icon && iconPosition === "right" && (
            <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          )}
        </div>
        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
