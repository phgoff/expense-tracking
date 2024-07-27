"use client";

import * as React from "react";
import { formatNumber } from "@/lib/utils";
import {
  UpdateExpenseModal,
  type UpdateExpenseDataType,
} from "./update-expense-modal";
import type { ExpenseListType } from "@/lib/db/query";

interface ExpenseListProps {
  listId: string;
  data: ExpenseListType;
}

export const ExpenseList = ({ listId, data }: ExpenseListProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] =
    React.useState<UpdateExpenseDataType | null>(null);

  return (
    <>
      {data.data.map((data) => (
        <div key={data.date} className="border-t pt-4 first:border-t-0">
          <div className="mb-2 flex justify-between">
            <p className="font-prompt font-semibold">{`${new Date(
              data.date,
            ).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}</p>
            <p className="text-sm font-semibold">
              THB {formatNumber(data.total)}
            </p>
          </div>
          <div className="space-y-2">
            {data.items.map(({ id, name, amount }) => (
              <div className="flex justify-between" key={id}>
                <p className="text-sm">{name}</p>
                <button
                  type="button"
                  className={`text-sm ${
                    amount > 0 ? "text-green-500" : "text-red-500"
                  }`}
                  onClick={() => {
                    setOpen(!open);
                    setSelectedData({
                      date: data.date,
                      listId,
                      id,
                      name,
                      amount,
                    });
                  }}
                >
                  {formatNumber(amount)}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <UpdateExpenseModal open={open} setOpen={setOpen} data={selectedData} />
    </>
  );
};
