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
import dayjs from "@/lib/dayjs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

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
  data: UpdateExpenseDataType;
}) => {
  const defaultType = data.amount > 0 ? "income" : "expense";
  const [selectedType, setSelectedType] = React.useState(defaultType);
  const [date, setDate] = React.useState<Date | undefined>(new Date(data.date));

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
    const amount = Number.parseFloat(form.amount.value);

    const { newAmount, diffAmount } = calculateAmounts(
      selectedType,
      amount,
      data.amount,
    );

    const newdata = {
      ...data,
      name,
      date: dayjs(date).format("YYYY-MM-DD"),
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
      setDate(new Date(data.date));
    }
  }, [open, defaultType, data.date]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-11/12 rounded-lg sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form onSubmit={submitHandler}>
          <DialogHeader>
            <DialogTitle>แก้ไขรายการ</DialogTitle>
            <DialogDescription>กดยืนยันเพื่อบันทึกข้อมูล</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="date">วันที่</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      dayjs(date).format("DD MMMM YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
