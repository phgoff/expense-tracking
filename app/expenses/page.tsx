import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getUserLists } from "@/lib/db/query";
import Link from "next/link";
import { AddListModal } from "@/components/add-list-modal";
import dayjs from "dayjs";
import { formatNumber } from "@/lib/utils";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const userLists = await getUserLists(user.id);

  return (
    <>
      <div className="m-2 space-y-4">
        <AddListModal userId={user.id} />
        <p>รายการทั้งหมด</p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto">
        {userLists.length === 0 ? (
          <p className="mt-4 text-center text-gray-400">ไม่มีข้อมูล</p>
        ) : (
          userLists.map((list) => {
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
                    {dayjs(list.updatedAt).format("DD/MM/YYYY HH:mm:ss")}{" "}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
