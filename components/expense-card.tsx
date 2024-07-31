"use client";

import React from "react";
import dayjs from "@/lib/dayjs";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExpenseCardItems } from "@/components/expense-card-items";
import { DynamicAddExpenseModal } from "@/components/dynamic-add-expense-modal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getExpensesByListAction } from "@/app/actions";
import type { ListType } from "@/lib/db/schema";

export function ExpenseCard({ list }: { list: ListType }) {
  const now = dayjs();
  const [month, setMonth] = React.useState(now.format("YYYY-MM"));

  const [months, setMonths] = React.useState({
    prev: dayjs(month).subtract(1, "month").format("YYYY-MM"),
    next: dayjs(month).add(1, "month").format("YYYY-MM"),
  });

  const { data } = useQuery({
    queryKey: ["expenses", list.id, month],
    queryFn: () => getExpensesByListAction(list.id, month),
  });

  React.useEffect(() => {
    setMonths({
      prev: dayjs(month).subtract(1, "month").format("YYYY-MM"),
      next: dayjs(month).add(1, "month").format("YYYY-MM"),
    });
  }, [month]);

  const onPrevMonthClick = () => setMonth(months.prev);

  const onNextMonthClick = () => setMonth(months.next);

  const onMoreThanOneMonthClick = () => setMonth(now.format("YYYY-MM"));

  const disableNextMonth = dayjs(months.next).isAfter(now.format("YYYY-MM"));
  const isMoreThanOneMonth = dayjs(month).isBefore(now.subtract(1, "month"));

  return (
    <div className="overflow-auto">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-center space-x-2 pt-1 font-prompt font-light">
          <Button
            variant="outline"
            size="icon"
            className="flex h-6 w-6"
            onClick={onPrevMonthClick}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <p className="text-sm">
            ยอดเดือน{" "}
            {new Date(month).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
            })}
          </p>
          <p className="text-sm">{formatNumber(data?.monthTotal ?? 0)} บาท</p>
          <Button
            variant="outline"
            size="icon"
            className="flex h-6 w-6"
            onClick={onNextMonthClick}
            disabled={disableNextMonth}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          {isMoreThanOneMonth && (
            <Button
              variant="outline"
              size="icon"
              className="flex h-6 w-6"
              onClick={onMoreThanOneMonthClick}
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex justify-around">
          <DynamicAddExpenseModal type="income" listId={list.id} />
          <DynamicAddExpenseModal type="expense" listId={list.id} />
        </div>
        <p className="text-lg font-bold">{list.name}</p>
        <div className="flex-1 overflow-auto">
          <ExpenseCardItems data={data} />
        </div>
      </div>
    </div>
  );
}
