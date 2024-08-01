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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "./spinner";
import dayjs from "@/lib/dayjs";

const initialInputs = [{ id: Date.now(), item: "", amount: "" }];
export const DynamicAddExpenseModal = ({
  type,
  listId,
}: {
  type: string;
  listId: string;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [inputs, setInputs] = React.useState(initialInputs);
  const containerRef = React.useRef<null | HTMLDivElement>(null);
  const title = type === "income" ? "รายรับ" : "รายจ่าย";

  React.useEffect(() => {
    if (containerRef.current && inputs.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [inputs]);

  React.useEffect(() => {
    if (!open) {
      setInputs(initialInputs);
    }
  }, [open]);

  const onAddInput = () => {
    setInputs([
      ...inputs,
      {
        id: Date.now(),
        item: "",
        amount: "",
      },
    ]);
  };

  const onInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    const updatedInputs: {
      id: number;
      item: string;
      amount: string;
      [key: string]: string | number;
    }[] = [...inputs];
    updatedInputs[index][name] = value;
    setInputs(updatedInputs);
  };

  const onDeleteInput = (id: number) => {
    const updatedInputs = inputs.filter((input) => input.id !== id);
    setInputs(updatedInputs);
  };

  const mutation = useMutation({
    mutationFn: addExpenesAction,
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["expenses", listId],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const onSummit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = inputs.map((input) => {
      const amount = Number.parseFloat(input.amount);
      return {
        listId,
        date: event.currentTarget.date.value,
        name: input.item,
        amount: type === "income" ? amount : -amount,
      };
    });
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">เพิ่ม{title}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[550px] w-11/12 rounded-lg sm:max-w-[425px]">
        <form onSubmit={onSummit}>
          <DialogHeader>
            <DialogTitle>บันทึก{title}</DialogTitle>
            <DialogDescription>
              {`เพิ่ม${title} กดยืนยันเพื่อบันทึกข้อมูล`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-4 px-2">
              <Label htmlFor="date">วันที่</Label>
              <Input id="date" defaultValue={dayjs().format("YYYY-MM-DD")} />
            </div>
            <div
              className="max-h-[290px] space-y-4 overflow-y-auto pb-2"
              ref={containerRef}
            >
              {inputs.map((input, index) => (
                <div key={input.id} className="space-y-2 px-2">
                  <div className="col-span-2 flex flex-col items-start gap-2">
                    <Label htmlFor={`item-${index}`}>รายการ {index + 1}</Label>
                    <Input
                      id={`item-${index}`}
                      name="item"
                      placeholder="ค่าใช้จ่าย"
                      className="focus:invalid:ring-red-500"
                      onChange={(event) => onInputChange(index, event)}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="col-span-2 flex flex-1 flex-col gap-2">
                      <Label htmlFor={`amount-${index}`} className="hidden">
                        จำนวน
                      </Label>
                      <Input
                        id={`amount-${index}`}
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.0"
                        className="focus:invalid:ring-red-500"
                        onChange={(event) => onInputChange(index, event)}
                        required
                      />
                    </div>
                    {inputs.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onDeleteInput(input.id)}
                        className="self-end"
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={onAddInput}
                className="mx-2"
              >
                เพิ่ม{title}
              </Button>
            </div>
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
