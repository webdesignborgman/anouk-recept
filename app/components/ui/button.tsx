// components/ui/button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", ...props },
    ref
  ) => {
    let variantClass = "";
    if (variant === "primary") {
      variantClass = "bg-primary text-primary-foreground hover:bg-primary/90";
    } else if (variant === "secondary") {
      variantClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    } else if (variant === "outline") {
      variantClass = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    }

    let sizeClass = "";
    if (size === "sm") {
      sizeClass = "h-9 rounded-md px-3 text-sm";
    } else if (size === "md") {
      sizeClass = "h-10 rounded-md px-4 py-2 text-base";
    } else if (size === "lg") {
      sizeClass = "h-11 rounded-md px-8 text-lg";
    }

    return (
      <button
        ref={ref}
        className={
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none " +
          variantClass +
          " " +
          sizeClass +
          " " +
          className
        }
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
