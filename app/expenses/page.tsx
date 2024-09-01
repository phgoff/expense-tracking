import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { ExpensesList } from "@/components/expenses-list";
import { AddListModal } from "@/components/add-list-modal";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import { HydrateClient, api } from "@/trpc/server";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  void api.list.getUserLists.prefetch();

  return (
    <>
      <div className="m-2 space-y-4">
        <AddListModal />
        <p>รายการทั้งหมด</p>
      </div>
      <HydrateClient>
        <Suspense
          fallback={
            <div className="mt-14 flex items-center justify-center text-gray-400">
              <Spinner />
              <p className="">กำลังโหลดข้อมูล...</p>
            </div>
          }
        >
          <ExpensesList />
        </Suspense>
      </HydrateClient>
    </>
  );
}
