"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { adddListAction } from "@/app/actions";
import Spinner from "./spinner";

export const AddListModal = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const addListWithUserIdAction = adddListAction.bind(null, userId);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">เพิ่มรายการใหม่</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded-lg sm:max-w-[425px]">
        <form
          action={addListWithUserIdAction}
          onSubmit={async (e) => {
            e.preventDefault();
            startTransition(async () => {
              const formData = new FormData(e.target as HTMLFormElement);
              await adddListAction(userId, formData);
              setOpen(false);
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>บันทึกรายการ</DialogTitle>
            <DialogDescription>
              เพิ่มรายการใหม่ กดยืนยันเพื่อบันทึกข้อมูล
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="item">รายการ</Label>
            <Input
              id="item"
              name="item"
              placeholder=""
              className="focus:invalid:ring-red-500"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              ยืนยัน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
