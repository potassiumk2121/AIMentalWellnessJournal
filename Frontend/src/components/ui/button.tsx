import * as React from "react";

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 ${className}`}
      {...props}
    />
  );
}