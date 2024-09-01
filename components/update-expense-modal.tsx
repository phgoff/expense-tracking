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
import Spinner from "./spinner";
import { toast } from "sonner";
import { api } from "@/trpc/react";

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

  const utils = api.useUtils();
  const updateMutation = api.expense.update.useMutation({
    onSuccess: async () => {
      await utils.expense.get.invalidate({ listId: data?.listId });
      await utils.list.get.invalidate({ listId: data?.listId });
      await utils.list.getUserLists.invalidate();
    },
    onError: (error) => {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const deleteMutation = api.expense.delete.useMutation({
    onSuccess: async () => {
      await utils.expense.get.invalidate({ listId: data?.listId });
      await utils.list.get.invalidate({ listId: data?.listId });
      await utils.list.getUserLists.invalidate();
    },
    onError: (error) => {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = data?.id;

    if (!id) {
      return;
    }

    const form = event.currentTarget;
    const name = form.item.value;
    const date = form.date.value;
    const amount = Number.parseFloat(form.amount.value);

    const { newAmount, diffAmount } = calculateAmounts(
      selectedType,
      amount,
      data.amount,
    );

    const newdata = {
      ...data,
      name,
      date,
      amount: newAmount,
    };

    updateMutation.mutate({ id, data: newdata, diffAmount });
  };

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data?.id) {
      return;
    }

    deleteMutation.mutate(data.id);
  };

  const handlers = {
    update: handleUpdate,
    delete: handleDelete,
  };

  const submitHandler = (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    const id = event.nativeEvent.submitter?.id as "update" | "delete";
    if (!id) {
      return;
    }
    handlers[id](event);
  };

  React.useEffect(() => {
    if (open) {
      setSelectedType(defaultType);
    }
  }, [open, defaultType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-11/12 rounded-lg sm:max-w-[425px]">
        <form onSubmit={submitHandler}>
          <DialogHeader>
            <DialogTitle>แก้ไขรายการ</DialogTitle>
            <DialogDescription>กดยืนยันเพื่อบันทึกข้อมูล</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="date">วันที่</Label>
              <Input id="date" defaultValue={data?.date} />
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
                  <SelectItem id="type" value="income">
                    รายรับ
                  </SelectItem>
                  <SelectItem id="type" value="expense">
                    รายจ่าย
                  </SelectItem>
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
            <div className="flex w-full justify-between">
              <Button
                type="submit"
                id="delete"
                variant="destructive"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Spinner />}
                ลบ
              </Button>

              <Button
                type="submit"
                id="update"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && <Spinner />}
                ยืนยัน
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
