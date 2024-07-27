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
import { signup } from "@/app/actions";
import { FormAction } from "@/components/form-action";
import { SubmitButton } from "@/components/submit-button";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <FormAction action={signup}>
          <CardHeader>
            <CardTitle className="text-center">สมัครบัญชี</CardTitle>
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
                  required
                />
              </div>
            </div>
            <Link href="/login">
              <Button variant="link" className="place-self-start p-0">
                เข้าสู่ระบบ?
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <SubmitButton className="w-full">สมัครบัญชี</SubmitButton>
          </CardFooter>
        </FormAction>
      </Card>
    </div>
  );
}
