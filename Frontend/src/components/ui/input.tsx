import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";