import React from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-ring shadow-lg shadow-primary/20",
    secondary:
      "bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-ring/40 border border-border",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-accent focus:ring-ring/40",
    danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const iconSpacing = {
    sm: iconPosition === "left" ? "mr-1.5" : "ml-1.5",
    md: iconPosition === "left" ? "mr-2" : "ml-2",
    lg: iconPosition === "left" ? "mr-2" : "ml-2",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
          )}
        </>
      )}
    </button>
  );
};
