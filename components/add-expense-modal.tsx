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
import { addExpenesAction } from "@/app/actions";

export const AddExpenseModal = ({
  type,
  listId,
}: {
  type: string;
  listId: string;
}) => {
  const onSummit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.item.value;
    const date = form.date.value;
    const amount = Number.parseFloat(form.amount.value);
    await addExpenesAction([
      {
        listId,
        date,
        name,
        amount: type === "income" ? amount : -amount,
      },
    ]);

    setOpen(false);
  };

  const title = type === "income" ? "รายรับ" : "รายจ่าย";

  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">เพิ่ม{title}</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px] rounded-lg">
        <form onSubmit={onSummit}>
          <DialogHeader>
            <DialogTitle>บันทึก{title}</DialogTitle>
            <DialogDescription>
              {`เพิ่ม${title} กดยืนยันเพื่อบันทึกข้อมูล`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="date">วันที่</Label>
              <Input
                id="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="item">รายการ</Label>
              <Input
                id="item"
                placeholder="ค่าใช้จ่าย"
                className="focus:invalid:ring-red-500"
                required
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="amount">จำนวน</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.0"
                className="focus:invalid:ring-red-500"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">ยืนยัน</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
