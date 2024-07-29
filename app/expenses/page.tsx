import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getUserLists } from "@/lib/db/query";
import { ExpensesList } from "@/components/expenses-list";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const lists = await getUserLists(user.id);

  return <ExpensesList userId={user.id} lists={lists} />;
}
