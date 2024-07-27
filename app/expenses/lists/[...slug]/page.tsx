import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getExpenses, getList } from "@/lib/db/query";
import { ExpenseList } from "@/components/expense-list";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
    queryFn: () => getExpenses(listId, month),
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {!list ? (
          <p className="mt-4 text-center text-gray-400">ไม่มีข้อมูล</p>
        ) : (
          <ExpenseList list={list} />
        )}
      </HydrationBoundary>
    </div>
  );
}
