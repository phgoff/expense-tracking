import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getUserLists } from "@/lib/db/query";
import { ExpensesList } from "@/components/expenses-list";
import { AddListModal } from "@/components/add-list-modal";
import { Suspense } from "react";
import Spinner from "@/components/spinner";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <div className="m-2 space-y-4">
        <AddListModal userId={user.id} />
        <p>รายการทั้งหมด</p>
      </div>
      <Suspense
        fallback={
          <div className="flex h-32 items-center justify-center text-gray-400">
            <Spinner />
            <p className="">กำลังโหลดข้อมูล...</p>
          </div>
        }
      >
        <UserList userId={user.id} />
      </Suspense>
    </>
  );
}

async function UserList({ userId }: { userId: string }) {
  const lists = await getUserLists(userId);
  return <ExpensesList lists={lists} />;
}
