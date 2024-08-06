import dayjs from "@/lib/dayjs";
import { redirect } from "next/navigation";
import { getList } from "@/lib/db/query";
import { ExpenseCard } from "@/components/expense-card";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import { getExpensesByListAction } from "@/app/actions";
import { validateRequest } from "@/lib/auth";

export default async function Page({ params }: { params: { slug: string } }) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  
  const listId = params.slug;
  const list = await getList(listId);

  if (!list || list.userId !== user.id) {
    return redirect("/expenses");
  }

  const now = dayjs();
  const month = now.format("YYYY-MM");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["expenses", listId, month],
    queryFn: () => getExpensesByListAction(listId, month),
  });

  return (
    <>
      <div className="space-y-2 text-center">
        <p className="text-sm font-light">
          คงเหลือ ณ วันที่{" "}
          <span className="font-normal text-blue-600">
            {now.format("DD/MM/YYYY")}
          </span>
        </p>
        <h1 className="text-4xl font-bold">{formatNumber(list.balance)}</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExpenseCard list={list} />
      </HydrationBoundary>
    </>
  );
}
