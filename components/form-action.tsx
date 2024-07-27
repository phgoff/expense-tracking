"use client";

import { useFormStatus, useFormState } from "react-dom";
import {} from "react-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

export function SubmitButtonX({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={cn(className)} disabled={pending}>
      {pending && <Spinner />}
      {children}
    </Button>
  );
}

export function FormAction({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (
    prevState: ActionResult,
    formData: FormData
  ) => Promise<ActionResult>;
}) {
  const [state, formAction] = useFormState(action, {
    error: null,
  });
  return (
    <form action={formAction} autoComplete="on">
      {children}
      {state.error && (
        <p className="text-red-500 px-6 py-2 -mt-4">{state.error}</p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
