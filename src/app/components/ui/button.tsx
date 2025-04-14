"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "default",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Define base styles for different variants
    const variants = {
      primary: "bg-[#093753] text-white hover:bg-[#0a4366]",
      secondary: "bg-[#334155] text-white hover:bg-[#475569]",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
      destructive: "bg-[#C11515] text-white hover:bg-[#A51212]",
      ghost: "bg-transparent hover:bg-gray-100",
      link: "bg-transparent text-[#093753] hover:underline p-0",
    };

    // Define base styles for different sizes
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 py-1 text-sm",
      lg: "h-12 px-6 py-3 text-lg",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        className={cn(
          "rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#093753] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
