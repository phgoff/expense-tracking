"use client";

import * as React from "react";
import { formatNumber } from "@/lib/utils";
import {
  UpdateExpenseModal,
  type UpdateExpenseDataType,
} from "./update-expense-modal";
import type { ExpenseListType } from "@/lib/db/query";

export const ExpenseCardItems = ({
  data,
}: {
  data: ExpenseListType | undefined;
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] =
    React.useState<UpdateExpenseDataType | null>(null);
  const listId = data?.list.id;

  if (data?.data.length === 0 || !listId) {
    return <p className="mt-4 text-center text-gray-400">ไม่มีข้อมูล</p>;
  }

  return (
    <>
      {data?.data.map((data) => (
        <div
          key={data.date}
          className="border-t py-4 first:border-t-0 first:pt-0"
        >
          <div className="mb-2 flex justify-between">
            <p className="font-prompt font-medium">{`${new Date(
              data.date,
            ).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}</p>
            <p className="text-sm font-medium">
              {formatNumber(data.total)} บาท
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
