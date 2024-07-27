"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateExpenseAction } from "@/app/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Spinner from "./spinner";

export interface UpdateExpenseDataType {
  listId: string;
  date: string;
  id: number;
  name: string;
  amount: number;
}

const calculateAmounts = (
  selectedType: string,
  amount: number,
  dataAmount: number,
) => {
  const newAmount = selectedType === "income" ? amount : -amount;
  const diffAmount = newAmount - dataAmount;

  return { newAmount, diffAmount };
};

export const UpdateExpenseModal = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: UpdateExpenseDataType | null;
}) => {
  const defaultType = data?.amount && data.amount > 0 ? "income" : "expense";
  const [selectedType, setSelectedType] = React.useState(defaultType);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateExpenseAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "expenses",
          data?.listId,
          dayjs(data?.date).format("YYYY-MM"),
        ],
      });
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = data?.id;

    if (!id) {
      return;
    }

    const form = event.currentTarget;
    const name = form.item.value;
    const amount = Number.parseFloat(form.amount.value);

    try {
      const { newAmount, diffAmount } = calculateAmounts(
        selectedType,
        amount,
        data.amount,
      );

      const newdata = {
        ...data,
        name,
        amount: newAmount,
      };

      await mutation.mutateAsync({ id, data: newdata, diffAmount });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }

    setOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      setSelectedType(defaultType);
    }
  }, [open, defaultType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-11/12 rounded-lg sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>แก้ไขรายการ</DialogTitle>
            <DialogDescription>กดยืนยันเพื่อบันทึกข้อมูล</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="date">วันที่</Label>
              <Input id="date" defaultValue={data?.date} disabled />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="type">ประเภท</Label>
              <Select
                onValueChange={(value) =>
                  setSelectedType(value as "income" | "expense")
                }
                defaultValue={defaultType}
              >
                <SelectTrigger className="mb-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">รายรับ</SelectItem>
                  <SelectItem value="expense">รายจ่าย</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="item">รายการ</Label>
              <Input
                id="item"
                placeholder="ค่าใช้จ่าย"
                defaultValue={data?.name}
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="amount">จำนวน</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                defaultValue={data?.amount && Math.abs(data.amount)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {mutation.isPending && <Spinner />}
              ยืนยัน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
