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
import { useMutation } from "@tanstack/react-query";
import Spinner from "./spinner";

export const AddListModal = ({ userId }: { userId: string }) => {
  const mutation = useMutation({
    mutationFn: adddListAction,
  });
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.item.value;

    await mutation.mutateAsync({ userId, name });

    setOpen(false);
  };

  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">เพิ่มรายการใหม่</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded-lg sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner /> : ""}
              ยืนยัน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
