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
import Spinner from "./spinner";
import { api } from "@/trpc/react";
import { toast } from "sonner";
export const AddListModal = () => {
  const [open, setOpen] = React.useState(false);

  const utils = api.useUtils();
  const mutation = api.list.add.useMutation({
    onSuccess: async () => {
      return await utils.list.getUserLists.invalidate();
    },
    onError: (error) => {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">เพิ่มรายการใหม่</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded-lg sm:max-w-[425px]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            mutation.mutate({ name: formData.get("item") as string });
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />}
              ยืนยัน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
