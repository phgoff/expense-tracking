import Link from "next/link";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { cn, formatNumber } from "@/lib/utils";
import { validateRequest } from "@/lib/auth";
import { getExpenses, getUserLists } from "@/lib/db/query";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/components/expense-list";
import { DynamicAddExpenseModal } from "@/components/dynamic-add-expense-modal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const userLists = await getUserLists(user.id);
  const listId = params.slug?.[0] ?? userLists[0].id;

  const now = dayjs();
  const month = params.slug?.[1] ?? now.format("YYYY-MM");

  const prevMonth = dayjs(month).subtract(1, "month").format("YYYY-MM");
  const nextMonth = dayjs(month).add(1, "month").format("YYYY-MM");

  const disableNextMonth = dayjs(nextMonth).isAfter(now.format("YYYY-MM"));
  const isMoreThanOneMonth = dayjs(month).isBefore(now.subtract(1, "month"));

  const expenseData = await getExpenses(listId, month);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-center space-x-2 font-prompt font-light">
        <Link href={`/expenses/${listId}/${prevMonth}`}>
          <Button variant="outline" size="icon" className="flex h-6 w-6">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-sm">
          ยอดเดือน{" "}
          {new Date(month).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
          })}
        </p>
        <p className="text-sm">{formatNumber(expenseData.monthTotal)} บาท</p>
        <Link
          href={`/expenses/${listId}/${nextMonth}`}
          className={cn(
            disableNextMonth ? "pointer-events-none opacity-50" : "",
          )}
          aria-disabled={disableNextMonth}
        >
          <Button variant="outline" size="icon" className="flex h-6 w-6">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </Link>
        {isMoreThanOneMonth && (
          <Link href={`/expenses/${listId}/${now.format("YYYY-MM")}`}>
            <Button variant="outline" size="icon" className="flex h-6 w-6">
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      <div className="flex justify-around">
        <DynamicAddExpenseModal type="income" listId={listId} />
        <DynamicAddExpenseModal type="expense" listId={listId} />
      </div>
      <div className="flex-1 space-y-4 overflow-y-scroll">
        <ExpenseList listId={listId} data={expenseData} />
      </div>
    </div>
  );
}
