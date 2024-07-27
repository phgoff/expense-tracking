import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getUserLists } from "@/lib/db/query";
import Link from "next/link";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const userLists = await getUserLists(user.id);

  return (
    <>
      <div className="mb-4 space-y-4">
        {/* <Button className="w-full">เพิ่มรายการใหม่</Button> */}
        <p>รายการทั้งหมด</p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto">
        {userLists.map((list) => {
          return (
            <Link
              href={`/expenses/lists/${list.id}`}
              key={list.id}
              className="flex w-full items-center justify-between rounded-lg border p-4"
            >
              <h1>{list.name}</h1>
              <p className="font-bold">{list.balance}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
