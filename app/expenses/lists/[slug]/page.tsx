import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getList } from "@/lib/db/query";
import { ExpenseCard } from "@/components/expense-card";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import { getExpensesByListAction } from "@/app/actions";

export default async function Page({ params }: { params: { slug: string } }) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const listId = params.slug;
  const list = await getList(listId);

  const month = dayjs().format("YYYY-MM");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["expenses", listId, month],
    queryFn: () => getExpensesByListAction(listId, month),
  });

  return (
    <>
      <div className="mb-1 space-y-2 text-center">
        <p className="text-sm font-light">
          คงเหลือ ณ วันที่{" "}
          <span className="font-normal text-blue-600">
            {dayjs().format("DD/MM/YYYY")}
          </span>
        </p>
        <h1 className="text-4xl font-bold">
          {formatNumber(list?.balance ?? 0)}
        </h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExpenseCard listId={listId} />
      </HydrationBoundary>
    </>
  );
}
