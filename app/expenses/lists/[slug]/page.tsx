import dayjs from "@/lib/dayjs";
import { redirect } from "next/navigation";
import { ExpenseCard } from "@/components/expense-card";

import { validateRequest } from "@/lib/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page({ params }: { params: { slug: string } }) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const listId = params.slug;

  if (!listId) {
    return redirect("/expenses");
  }

  const month = dayjs().format("YYYY-MM");

  void api.expense.get.prefetch({ listId, month });
  void api.list.get.prefetch({ listId });

  return (
    <HydrateClient>
      <ExpenseCard listId={listId} />
    </HydrateClient>
  );
}
