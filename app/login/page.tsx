import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FormAction } from "@/components/form-action";
import { SubmitButton } from "@/components/submit-button";
import { login } from "@/app/actions";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <FormAction action={login}>
          <CardHeader>
            <CardTitle className="text-center">เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  className="peer focus:invalid:border-red-500 focus:invalid:ring-red-500"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            <Link href="/signup">
              <Button
                variant="link"
                type="button"
                className="place-self-start p-0"
              >
                สมัครบัญชี
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <SubmitButton className="w-full">เข้าสู่ระบบ</SubmitButton>
          </CardFooter>
        </FormAction>
      </Card>
    </div>
  );
}
