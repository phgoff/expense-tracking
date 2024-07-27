"use client";
import * as React from "react";

import { type ButtonProps, Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import Spinner from "./spinner";

const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <Button ref={ref} {...props}>
        {pending && <Spinner />}
        {children}
      </Button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
