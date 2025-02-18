"use client";
import { formatDate } from "@/lib/dayjs";
import { formatNumber } from "@/lib/utils";
import { api } from "@/trpc/react";
import Link from "next/link";

export function ExpensesList() {
  const [lists] = api.list.getUserLists.useSuspenseQuery();
  return (
    <div className="flex-1 space-y-4 overflow-auto">
      {lists?.length === 0 ? (
        <p className="mt-14 text-center text-gray-400">ไม่มีข้อมูล</p>
      ) : (
        lists?.map((list) => {
          return (
            <Link
              href={`/expenses/lists/${list.id}`}
              key={list.id}
              className="flex w-full items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-100"
            >
              <h1>{list.name}</h1>
              <div>
                <p className="text-right font-bold">
                  {formatNumber(list.balance)}
                </p>
                <p className="text-xs font-light text-gray-500">
                  {formatDate(list.updatedAt, "DD/MM/YYYY HH:mm:ss")}
                </p>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
