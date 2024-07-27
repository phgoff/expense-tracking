import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("w-4 h-4", className, "mr-2 animate-spin")}
      >
        <title>Spinner</title>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
